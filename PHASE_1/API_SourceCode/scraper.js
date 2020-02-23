const axios = require('axios');
const cheerio = require('cheerio')
const base_whs = 'https://www.who.int'
// Grab the page
axios(base_whs + '/emergencies/diseases/en/')
	.then(response => {
		const html = response.data;
		const $ = cheerio.load(html)
		const pages = [];

		// Find the list of recent events
		const lis = $('.auto_archive > li');
		// For each event, add the url to the list
		lis.each(function(){
			pages.push(base_whs + $(this).find('a').attr('href'))
		})
		// For each url, grab article information
		return Promise.all(
			pages.map(url =>{
				return parseURL(url)
			})
		)
	}).then(res =>{
		console.log(res)
	})
	.catch(console.error);
// Grab info from article
function parseURL(url){
	return axios(url)
		.then(response =>{
			const html = response.data;
			const $ = cheerio.load(html);
			const meta = $('.meta').children().text().split('\n')[1].split(' ');
			const date = meta[2] + '-' + monthParse(meta[1]) + '-' + meta[0] + ' xx:xx:xx'
			const headline = $('.headline').text()
			const main_text = [];
			// WHO has an aides website structure, idk if this will work for all articles on their site, but so far so good :shrug
			$('#primary').children().next().next().each(function(){
				if ($(this).is('p')){
					main_text.push($(this).text().replace(/(\\[tn])/g, "").trim())
				}else{
					return false;
				}
			})
			return {url: url, date_of_publication: date, headline: headline, main_text: main_text.join('\n')}

		})
		.catch(console.error)
}
// gOoD cOdInG
function monthParse(mon){
	var months = {
		'january' : '01',
		'february' : '02',
		'march' : '03',
		'april' : '04',
		'may' : '05',
		'june' : '06',
		'july' : '07',
		'august' : '08',
		'september' : '09',
		'october' : '10',
		'november' : '11',
		'december' : '12'
	}
	return months[mon.toLowerCase()]
}
