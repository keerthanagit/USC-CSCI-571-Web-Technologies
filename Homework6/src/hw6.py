from flask import Flask, current_app, request, jsonify
from newsapi import NewsApiClient
from newsapi.newsapi_exception import NewsAPIException
from collections import Counter
import operator

app = Flask(__name__)

newsapi = NewsApiClient(api_key='78af5e6c7a314d6abba609c99c2a37d8')


@app.route("/")
def home():
    return current_app.send_static_file("HomePage.html")


@app.route("/script.js")
def script():
    return current_app.send_static_file("script.js")


@app.route("/style.css")
def css():
    return current_app.send_static_file("style.css"), {'Content-Type': 'text/css '}


@app.route("/headlines")
def headlines():
    # /v2/top-headlines
    top_headlines = newsapi.get_top_headlines(country='us', language='en', page_size=30)
    articles = top_headlines.get("articles")
    titles = ""
    for article in articles:
        titles += article.get("title") + " "
    titles = titles.split()
    word_objects = dict(Counter(titles))
    temp = {}
    STOP_WORDS = ["-", "-", "a", "a's", "able", "about", "above", "according", "accordingly", "across", "actually",
                  "after", "afterwards", "again", "against", "ain't", "all", "allow", "allows", "almost", "alone",
                  "along", "already", "also", "although", "always", "am", "among", "amongst", "an", "and", "another",
                  "any", "anybody", "anyhow", "anyone", "anything", "anyway", "anyways", "anywhere", "apart", "appear",
                  "appreciate", "appropriate", "are", "aren't", "around", "as", "aside", "ask", "asking", "associated",
                  "at", "available", "away", "awfully", "b", "be", "became", "because", "become", "becomes", "becoming",
                  "been", "before", "beforehand", "behind", "being", "believe", "below", "beside", "besides", "best",
                  "better", "between", "beyond", "both", "brief", "but", "by", "c", "c'mon", "c's", "came", "can",
                  "can't", "cannot", "cant", "cause", "causes", "certain", "certainly", "changes", "clearly", "co",
                  "com", "come", "comes", "concerning", "consequently", "consider", "considering", "contain",
                  "containing", "contains", "corresponding", "could", "couldn't", "course", "currently", "d",
                  "definitely", "described", "despite", "did", "didn't", "different", "do", "does", "doesn't", "doing",
                  "don't", "done", "down", "downwards", "during", "e", "each", "edu", "eg", "eight", "either", "else",
                  "elsewhere", "enough", "entirely", "especially", "et", "etc", "even", "ever", "every", "everybody",
                  "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "f", "far", "few",
                  "fifth", "first", "five", "followed", "following", "follows", "for", "former", "formerly", "forth",
                  "four", "from", "further", "furthermore", "g", "get", "gets", "getting", "given", "gives", "go",
                  "goes", "going", "gone", "got", "gotten", "greetings", "h", "had", "hadn't", "happens", "hardly",
                  "has", "hasn't", "have", "haven't", "having", "he", "he's", "hello", "help", "hence", "her", "here",
                  "here's", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "hi", "him", "himself",
                  "his", "hither", "hopefully", "how", "howbeit", "however", "i", "i'd", "i'll", "i'm", "i've", "ie",
                  "if", "ignored", "immediate", "in", "inasmuch", "inc", "indeed", "indicate", "indicated", "indicates",
                  "inner", "insofar", "instead", "into", "inward", "is", "isn't", "it", "it'd", "it'll", "it's", "its",
                  "itself", "j", "just", "k", "keep", "keeps", "kept", "know", "knows", "known", "l", "last", "lately",
                  "later", "latter", "latterly", "least", "less", "lest", "let", "let's", "like", "liked", "likely",
                  "little", "look", "looking", "looks", "ltd", "m", "mainly", "many", "may", "maybe", "me", "mean",
                  "meanwhile", "merely", "might", "more", "moreover", "most", "mostly", "much", "must", "my", "myself",
                  "n", "name", "namely", "nd", "near", "nearly", "necessary", "need", "needs", "neither", "never",
                  "nevertheless", "new", "next", "nine", "no", "nobody", "non", "none", "noone", "nor", "normally",
                  "not", "nothing", "novel", "now", "nowhere", "o", "obviously", "of", "off", "often", "oh", "ok",
                  "okay", "old", "on", "once", "one", "ones", "only", "onto", "or", "other", "others", "otherwise",
                  "ought", "our", "ours", "ourselves", "out", "outside", "over", "overall", "own", "p", "particular",
                  "particularly", "per", "perhaps", "placed", "please", "plus", "possible", "presumably", "probably",
                  "provides", "q", "que", "quite", "qv", "r", "rather", "rd", "re", "really", "reasonably", "regarding",
                  "regardless", "regards", "relatively", "respectively", "right", "s", "said", "same", "saw", "say",
                  "saying", "says", "second", "secondly", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen",
                  "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "shall", "she",
                  "should", "shouldn't", "since", "six", "so", "some", "somebody", "somehow", "someone", "something",
                  "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "specified", "specify",
                  "specifying", "still", "sub", "such", "sup", "sure", "t", "t's", "take", "taken", "tell", "tends",
                  "th", "than", "thank", "thanks", "thanx", "that", "that's", "thats", "the", "their", "theirs", "them",
                  "themselves", "then", "thence", "there", "there's", "thereafter", "thereby", "therefore", "therein",
                  "theres", "thereupon", "these", "they", "they'd", "they'll", "they're", "they've", "think", "third",
                  "this", "thorough", "thoroughly", "those", "though", "three", "through", "throughout", "thru", "thus",
                  "to", "together", "too", "took", "toward", "towards", "tried", "tries", "truly", "try", "trying",
                  "twice", "two", "u", "un", "under", "unfortunately", "unless", "unlikely", "until", "unto", "up",
                  "upon", "us", "use", "used", "useful", "uses", "using", "usually", "uucp", "v", "value", "various",
                  "very", "via", "viz", "vs", "w", "want", "wants", "was", "wasn't", "way", "we", "we'd", "we'll",
                  "we're", "we've", "welcome", "well", "went", "were", "weren't", "what", "what's", "whatever", "when",
                  "whence", "whenever", "where", "where's", "whereafter", "whereas", "whereby", "wherein", "whereupon",
                  "wherever", "whether", "which", "while", "whither", "who", "who's", "whoever", "whole", "whom",
                  "whose", "why", "will", "willing", "wish", "with", "within", "without", "won't", "wonder", "would",
                  "would", "wouldn't", "x", "y", "yes", "yet", "you", "you'd", "you'll", "you're", "you've", "your",
                  "yours", "yourself", "yourselves", "z", "zero"]
    for key, value in word_objects.items():
        if key.lower() not in STOP_WORDS and not key.isdigit():
            temp[key] = value

    sorted_list = sorted(temp.items(), key=operator.itemgetter(1), reverse=True)
    dd = []
    dd1 = dict()
    dd2 = []
    i = 0
    for data in sorted_list:
        if i == 30:
            break
        x = (data[0].lower()).capitalize()
        if x in dd1:
            dd1[x] += data[1]
        else:
            dd1[x] = data[1]
        i += 1

    for key, value in dd1.items():
        dd2.append((key, value))

    i = 0
    for data in sorted_list:
        if i == 30:
            break
        dd.append(data)
        i += 1
    top_headlines["articles"] = getTop(articles, 5)
    top_headlines["totalResults"] = 5
    top_headlines["frequentWords"] = dd2
    return jsonify(top_headlines)


def getTop(articles, size):
    ans = []
    count = 0
    keys = ["author", "description", "title", "url", "urlToImage", "publishedAt", "source"]
    source_keys = ["name"]
    if articles is not None:
        for article in articles:
            if count == size:
                break
            flag = True
            for key in keys:
                if key not in article or article.get(key) is None:
                    flag = False
                    #print('Error1= ' + str(article))
                    break
                flag_source = True
                if key == "source":
                    src = article.get("source")
                    for source_key in source_keys:
                        if source_key not in src or src.get(source_key) is None:
                            flag_source = False
                            #print('Error2= ' + str(article))
                            break
                if not flag_source:
                    flag = False
                    #print('Error3= ' + str(article))
                    break
            if flag:
                ans.append(article)
                count += 1
    return ans


@app.route("/cnn")
def cnn():
    cnn_headlines = newsapi.get_top_headlines(sources='cnn', language='en', page_size=30)
    return jsonify(cnn_headlines)


@app.route("/fox")
def fox():
    fox_headlines = newsapi.get_top_headlines(sources='fox-news', language='en', page_size=30)
    return jsonify(fox_headlines)


@app.route("/sources/<name>")
def sources(name):
    result = {}
    if name == "all":
        srcs = newsapi.get_sources(language='en', country='us')
    else:
        srcs = newsapi.get_sources(category=name, language='en', country='us')
    temps = srcs.get("sources")
    ss = []
    count = 0
    for temp in temps:
        if count == 10:
            break
        ss.append(temp)
        count += 1
    result["sources"] = ss
    return jsonify(result)


@app.route("/allsources")
def allsources():
    result = newsapi.get_sources(language='en', country='us')
    return jsonify(result)


@app.route("/searchresults")
def searchresults():
    try:
        keyword = request.args.get('keyword')
        src = request.args.get('source')
        from_date = request.args.get('from_date')
        to_date = request.args.get('to_date')
        if src == "all":
            print(from_date)
            print(to_date)
            result = newsapi.get_everything(q=keyword, from_param=from_date, to=to_date, language='en',
                                            sort_by='publishedAt')
        else:
            print(from_date)
            print(to_date)
            result = newsapi.get_everything(q=keyword, sources=src, from_param=from_date, to=to_date, language='en',
                                            sort_by='publishedAt')
        articles = result.get("articles")
        result["articles"] = getTop(articles, 15)
        return jsonify(result)
    except NewsAPIException as exp:
        return jsonify({'status': exp.get_status(), 'code': exp.get_code(), 'message': exp.get_message()})


if __name__ == "__main__":
    app.run()
