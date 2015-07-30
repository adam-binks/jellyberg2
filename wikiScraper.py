import wikipedia

def getCountryArea(country):
	page = wikipedia.page(country)

	html = page.html().encode("utf-8")
	tableIndex = html.index('infobox geography vcard')
	infoTablePlus = html[tableIndex:]
	print(infoTablePlus)  
	


	# content = page.content.encode("utf-8")
	# index = page.content.index('area')
	# index += len('area')
	# postAreaString = content[index:index+500]
	# print(country)
	# print(content)

	# area = ''
	# for char in postAreaString:
	# 	if not char in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']:
	# 		if area == '' or char in [',', ' ', '.']:
	# 			continue
	# 		else:
	# 			print(char)
	# 			return int(area)
	# 	else:
	# 		area += char


for country in ['russia', 'england', 'brazil', 'luxembourg']:
	print(country + ': ' + str(getCountryArea(country)))