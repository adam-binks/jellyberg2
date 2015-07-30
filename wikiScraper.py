import wikipedia
import pyperclip

print('downloading...')

def getCountryArea(country):
	page = wikipedia.page(country)

	html = page.html().encode("utf-8")
	# chop off all the stuff before the area
	text = trimText(html, 'infobox geography vcard')
	text = trimText(text, 'Area')
	text = trimText(text, 'Total')

	# then look for numbers until the end of the number is reached
	areaString = ""
	for char in text:
		if char in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']:
			# we've found the area
			areaString += char
		else:
			if areaString != "" and char not in [',', ' ']:
				# a number has been entered
				break
			else:
				# no number - we're still in html syntax
				continue
	return int(areaString)


def trimText(fullText, searchTerm):
	index = fullText.lower().index(searchTerm.lower())
	return fullText[index:]
	

def generateJson(countries):
	json = ', ';
	for country in countries:
		json += '"'+country+'": ' + str(getCountryArea(country))
		if country != countries[-1]:
			json += ', '
		else:
			json += '};'
	return json


json = generateJson(['russia', 'wales', 'new zealand', 'bosnia'])

pyperclip.copy(json)
print(json)