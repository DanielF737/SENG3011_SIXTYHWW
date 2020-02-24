const axios = require('axios');
const cheerio = require('cheerio')
const base_url = 'http://outbreaks.globalincidentmap.com/'
// Grab the page
axios(base_url)
	.then(response => {
		const html = response.data;
		const $ = cheerio.load(html)
		const pages = [];

		// Find the list of recent events
		const items = $('#pic1');
		links = items.find('.b2')
		links.each(function(){
			pages.push([base_url + $(this).attr('href'), $(this).text().trim()])
		})
		// For each event, add the url to the list
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
	return axios(url[0])
		.then(response =>{
			data = []
			const html = response.data;
			const $ = cheerio.load(html);
			$('.tdline').filter(function(i, el){
				return $(this).text().trim() !== ""
			})
			.each(function(){
				data.push($(this).text().trim())
			})
			console.log(data)
			text = $(".tdtext").text().split("\n").join(" ").replace(/ +(?= )/g,'').trim()
			return {url: url[0], date_of_publication: data[3],
				headline: url[1], main_text: text}

		})
		.catch(console.error)
}

