import requests
import json
from bs4 import BeautifulSoup

def parse_page(course_page):
    url = "http://student.mit.edu/catalog/m" + course_page + ".html"
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    data = {}

    for i in soup.select("p > h3"):
        num_title = i.get_text()
        splitup = num_title.split(" ")
        number = splitup[0].strip()
        title = str.join(" ", splitup[1:]).strip()
        # strip extra \n chars
        if title.find("\n") != -1:
            title = title[:title.index("\n")]
        paragraph = i.parent
        #print(paragraph.contents[0].get_text())
        bars = paragraph.find_all("img", src="/icns/hr.gif")
        texts = bars[1].find_all_next(string=True, limit=3)
        description = texts[1].strip()
        if len(description.split(" ")) > 40:
            #print("Course number: " + number)
            #print("Title: " + title)
            #print("Description: " + texts[1])

            data[title] = {
                "title": title,
                "number": number,
                "description": description}


    return data


course_pages = {
        "1": ["a", "b", "c"],
        "2": ["a", "b", "c"],
        "3": ["a", "b"],
        "4": ["a", "b", "c", "d", "e", "f", "g"],
        "5": ["a", "b"],
        "6": ["a", "b", "c"],
        "7": ["a"],
        "8": ["a", "b"],
        "9": ["a", "b"],
        "10": ["a", "b"],
        "11": ["a", "b", "c"],
        "12": ["a", "b", "c"],
        "14": ["a", "b"],
        "15": ["a", "b", "c"],
        "16": ["a", "b"],
        "17": ["a", "b"],
        "18": ["a", "b"],
        "20": ["a"],
        "21": ["a"],
        "21A": ["a"],
        "CMS": ["a"],
        "21W": ["a"],
        "21G": ["a", "b", "c", "d", "e", "f", "g", "h", "q", "r", "s"],
        "21H": ["a", "b"],
        "21L": ["a"],
        "21M": ["a", "b"],
        "WGS": ["a"],
        "22": ["a", "b", "c"],
        "24": ["a", "b"],
        "CC": ["a"],
        "EC": ["a"],
        "EM": ["a"],
        "ES": ["a"],
        "HST": ["a", "b"],
        "IDS": ["a"],
        "MAS": ["a"],
        "SCM": ["a"],
        "STS": ["a", "b"],
}
for course in course_pages.keys():
    print("working on: " + course) 
    data = {}
    for pg in course_pages[course]:
        print("page: " + course+pg)
        parsed = parse_page(course+pg)
        data.update(parsed)
        
    with open("courses/"+course+".json", 'w') as outfile:
        json.dump(data, outfile)
