document.getElementById("output").onclick = output
let content = document.getElementById("content");
let str;
let words;
const maxWords = getRandomInt(1000, 1200)

function output() {
    content.innerHTML = ""
    move()
    str = shuffleArray(sentences).join(".")
    words = str.split(" ")
    addWords(0)
}

function addWords(i) {
    if (i < maxWords) {
        let textNode = document.createTextNode(words[i] + ' ');
        content.appendChild(textNode);
        setTimeout(() => addWords(i + 1), 100);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const essay = `The relationship between English ability and IT career is not straightforward, but it can be said that having a good command of English can open up many opportunities and benefits for IT professionals. Here are some possible reasons why:
    English is the most widely used language in the world, especially in the fields of science, technology, business and education. According to a report by the British Council, English is spoken by about 1.75 billion people worldwide, and it is estimated that by 2023, two billion people will be using it1.
    Many IT companies and organizations operate globally and require their employees to communicate with clients, partners and colleagues from different countries and cultures. Having a high level of English proficiency can help IT professionals to communicate effectively, build rapport, negotiate, persuade and collaborate with others in various contexts and situations.
    English is also the dominant language of the internet, as well as the main language of programming, coding and software development. According to a study by W3Techs, 60.4% of all websites use English as their content language2. Moreover, most programming languages, such as Java, Python, C++, Ruby and PHP, are based on English syntax and keywords. Therefore, having a good knowledge of English can help IT professionals to access more information, resources and tools online, as well as to create, debug and maintain code more easily and efficiently.
    Additionally, English is the language of innovation and creativity in the IT field. Many new terms, concepts and ideas are coined and expressed in English first, before being translated or adapted into other languages. For example, words like “cloud computing”, “big data”, “artificial intelligence” and “blockchain” are all originated from English. Therefore, having a strong grasp of English can help IT professionals to keep up with the latest trends, developments and opportunities in the IT industry.
    Furthermore, English is the language of education and learning in the IT field. Many prestigious universities and institutions around the world offer IT courses and programs in English, either online or on-campus. For example, MIT, Stanford, Harvard, Oxford and Cambridge are some of the top-ranked universities that offer IT degrees in English3. Moreover, many online platforms and websites, such as Coursera, edX, Udemy and Khan Academy, provide free or low-cost IT courses and tutorials in English for learners of all levels. Therefore, having a good command of English can help IT professionals to enhance their skills, knowledge and qualifications in the IT field.

    In conclusion, English ability and IT career are related in many ways. Having a good command of English can help IT professionals to communicate better, access more information, create more code, keep up with innovation and learn more effectively. These can lead to more career opportunities and benefits for IT professionals in the globalized and competitive IT industry. It is possible to work in the IT industry without knowing English, but it can be very challenging and limiting. Here are some of the difficulties and disadvantages that I may face if I do not know English:

    I may have trouble communicating with my colleagues, clients and partners from different countries and cultures. I may miss out on important information, feedback and opportunities. I may also encounter misunderstandings, conflicts and errors that could affect my work performance and reputation.
    I may have difficulty accessing, understanding and using the vast amount of information, resources and tools that are available online in English. I may not be able to learn from the best practices, examples and solutions that are shared by other IT professionals around the world. I may also struggle to keep up with the latest trends, developments and innovations in the IT field.
    I may have trouble creating, debugging and maintaining code that is based on English syntax and keywords. I may not be able to use some of the most popular and powerful programming languages, such as Java, Python, C++, Ruby and PHP. I may also face compatibility and interoperability issues with other systems and platforms that use English as their content language.
    I may have limited options for education and learning in the IT field. I may not be able to enroll in some of the top-ranked universities and institutions that offer IT courses and programs in English. I may also miss out on some of the best online platforms and websites that provide free or low-cost IT courses and tutorials in English for learners of all levels.
    I may have fewer career opportunities and benefits in the IT industry. I may not be able to apply for some of the most prestigious and lucrative IT jobs and projects that require a high level of English proficiency. I may also face more competition and discrimination from other IT professionals who know English.

    Therefore, if I want to work in the IT industry, it is highly recommended that I learn English or improve my English skills. English can help I to communicate better, access more information, create more code, keep up with innovation and learn more effectively. These can lead to more career opportunities and benefits for I in the globalized and competitive IT industry. First, I need to determine what level of English I need for IT jobs. This may vary depending on the specific job requirements and the country I am working in, but in general, I may need at least a B2 level of English to work in the IT industry. This means that I can communicate effectively in most situations, understand complex texts and write clear and detailed texts.

    Second, I need to assess my current level of English. I can do this by taking a test that measures my skills according to the CEFR scale, which has six levels from A1 to C2. I can find some online tests here2 or here3.

    Third, I need to calculate how many hours of instruction I need to reach my target level from my current level. Here is a table that shows the approximate number of hours needed for each level4:

    For example, if I am currently at A2 level and I want to reach B2 level, I need 300 + 200 = 500 hours of instruction. However, this number may vary depending on my native language, my motivation and other factors. If my native language is very different from English, such as Chinese or Arabic, I may need more hours than if my native language is closer to English, such as Spanish or German5.

    Fourth, I need to decide how much time I can devote to learning English every day or every week. The more time I spend, the faster I will learn. However, I also need to balance my time with other commitments and activities. I may also need to consider the quality and intensity of my learning time. For example, studying for one hour in a focused and interactive way may be more effective than studying for two hours in a passive and distracted way.

    Fifth, I need to choose the best learning methods and resources for my needs and preferences. There are many ways to learn English, such as taking a course, using online platforms, reading books, watching videos, listening to podcasts, playing games, chatting with native speakers and so on. I may want to use a combination of different methods and resources to expose yourself to different aspects of the language and keep yourself motivated and interested.

    Sixth, I need to practice my English skills as much as possible in real-life situations. This will help I to improve my fluency, accuracy and confidence in using the language. I can practice my English by joining online communities, participating in projects, attending events, volunteering or working in an English-speaking environment and so on. I can also seek feedback from others on my progress and performance.

    To sum up, there is no definitive answer to how long it takes to learn English for IT jobs, but I can estimate it by following these steps: Determine my target level of English, Assess my current level of English, Calculate the number of hours of instruction needed, Decide how much time I can spend on learning, Choose the best learning methods and resources, Practice my English skills in real-life situations.
    According to the web search results, English is the most widely used language in the IT career. Some of the reasons are:

    English is the most widely spoken language in the business world and makes communication between different countries and cultures possible.
    English is the language of technology and network-related fields, as most of the software, applications, websites and manuals are written in English.
    English can help you learn new skills and access more information, as many online courses, books, journals and articles are available in English.
    English can boost my career growth and opportunities, as being multilingual is a valuable asset and may result in a promotion or a higher salary, especially in a competitive industry like the IT sector.

    Therefore, learning English can have many personal and professional benefits for IT professionals.Yes, you can learn programming without knowing English, but it might be more challenging. Most programming languages use English keywords and syntax, and most programming resources, such as books, tutorials, and documentation, are written in English. However, there are some programming languages that are not based on English, such as Chinese Python, HindiPy, and FarsiLua. These languages allow you to write code in my native language, using transliteration or translation of English keywords. You can also find some online courses and communities that teach programming in other languages, such as [Code.org], [Codecademy], and [SoloLearn]. These platforms offer interactive lessons and exercises in various languages, such as Spanish, French, Arabic, and more. You can also use online tools such as [Google Translate] or [Bing Translator] to help you understand English texts or websites related to programming. However, these tools are not always accurate or reliable, so you should use them with caution. Learning programming without knowing English is possible, but it might limit my options and opportunities. If you want to learn more advanced concepts, use popular frameworks and libraries, or collaborate with other programmers around the world, you might need to learn some English along the way. English is the most widely used language in the field of programming, and it can help you access more resources and information. Therefore, I suggest that you try to learn some basic English vocabulary and grammar related to programming, as well as some common terms and acronyms that programmers use. This will make my learning process easier and more enjoyable.

    `
const sentences = essay.split(".")

let i = 0;

function move() {
    if (i === 0) {
        i = 1;
        const elem = document.getElementById("myBar");
        let width = 1;
        const id = setInterval(frame, 500);

        function frame() {
            if (width >= 100) {
                clearInterval(id);
                i = 0;
            } else {
                width += 0.3;
                elem.style.width = width + "%";
                elem.innerHTML = width.toFixed(2) + "%";
            }
        }
    }
}