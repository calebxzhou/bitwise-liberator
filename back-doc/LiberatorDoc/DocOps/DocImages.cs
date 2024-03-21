using System.Drawing;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using SixLabors.ImageSharp;
using A = DocumentFormat.OpenXml.Drawing;
using DW = DocumentFormat.OpenXml.Drawing.Wordprocessing;
using PIC = DocumentFormat.OpenXml.Drawing.Pictures;

namespace LiberatorDoc.DocOps;

public class DocImages
{
    public static Drawing AddImage(MainDocumentPart mainPart, string base64Image)
    {
        var imageBytes = Convert.FromBase64String(base64Image);
        var tempFilePath = Path.GetTempFileName();
        File.WriteAllBytes(tempFilePath, imageBytes);
        var imagePart = mainPart.AddImagePart(ImagePartType.Png);
        // Copy the image to the Word document
        using (Stream stream = new FileStream(tempFilePath, FileMode.Open))
        {
            imagePart.FeedData(stream);
        }

        var wh = GetImageWidthHeightEmu(imageBytes);
        var drawing = GetImageDrawing(mainPart.GetIdOfPart(imagePart), wh.Item1, wh.Item2);
        // Delete the temporary file
        File.Delete(tempFilePath);
        return drawing;
    }

    private static Drawing GetImageDrawing(string relationshipId, long width, long height)
    {
        var element =
            new Drawing(
                new DW.Inline(
                    new DW.Extent() { Cx = width, Cy = height },
                    new DW.EffectExtent()
                    {
                        LeftEdge = 0L,
                        TopEdge = 0L,
                        RightEdge = 0L,
                        BottomEdge = 0L
                    },
                    new DW.DocProperties()
                    {
                        Id = (UInt32Value)1U,
                        Name = relationshipId
                    },
                    new DW.NonVisualGraphicFrameDrawingProperties(
                        new A.GraphicFrameLocks() { NoChangeAspect = true }),
                    new A.Graphic(
                        new A.GraphicData(
                                new PIC.Picture(
                                    new PIC.NonVisualPictureProperties(
                                        new PIC.NonVisualDrawingProperties()
                                        {
                                            Id = (UInt32Value)0U,
                                            Name = relationshipId + ".jpg"
                                        },
                                        new PIC.NonVisualPictureDrawingProperties()),
                                    new PIC.BlipFill(
                                        new A.Blip(
                                            new A.BlipExtensionList(
                                                new A.BlipExtension()
                                                {
                                                    Uri =
                                                        "{28A0092B-C50C-407E-A947-70E740481C1C}"
                                                })
                                        )
                                        {
                                            Embed = relationshipId,
                                            CompressionState =
                                                A.BlipCompressionValues.Print
                                        },
                                        new A.Stretch(
                                            new A.FillRectangle())),
                                    new PIC.ShapeProperties(
                                        new A.Transform2D(
                                            new A.Offset() { X = 0L, Y = 0L },
                                            new A.Extents() { Cx = width, Cy = height }),
                                        new A.PresetGeometry(
                                                new A.AdjustValueList()
                                            )
                                            { Preset = A.ShapeTypeValues.Rectangle }))
                            )
                            { Uri = "http://schemas.openxmlformats.org/drawingml/2006/picture" })
                )
                {
                    DistanceFromTop = (UInt32Value)0U,
                    DistanceFromBottom = (UInt32Value)0U,
                    DistanceFromLeft = (UInt32Value)0U,
                    DistanceFromRight = (UInt32Value)0U,
                    EditId = "50D07946"
                }
            );
        // Append the reference to body, the element should be in a Run.
        return element;
    }
    public static (long, long) GetImageWidthHeightEmu(byte[] imageBytes)
    {

        using (var ms = new MemoryStream(imageBytes, 0, imageBytes.Length))
        {
            // Create an Image object from the MemoryStream
            Image image = Image.Load(ms);

            // Convert pixels to EMUs
            long widthInEmus = image.Width * 9525;
            long heightInEmus = image.Height * 9525;

            return (widthInEmus, heightInEmus);
        }
    }
}