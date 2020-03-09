const axios = require('axios');
const cheerio = require('cheerio')
const base_url = 'http://outbreaks.globalincidentmap.com/'
const fs = require('fs')
let diseases = JSON.parse(fs.readFileSync('disease_list.json'));
let syndromes = JSON.parse(fs.readFileSync('syndrome_list.json'));
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
			pages.map(url => {
				return parseURL(url)
			})
		)
	}).then(res =>{
		res.forEach(e =>{
			console.log(e.reports[0])
		})
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
			text = $(".tdtext").text().split("\n").join(" ").replace(/ +(?= )/g,'').trim()
			let d = ''
			let s = ''
			if (data[1].includes('/')){
				d = parseDisease(data[1].split(' / ')[0].trim())
				s = parseSyndrome(data[1].split(' / ')[1].trim())
			}else{
				d = parseDisease(data[1])
			}
			return {
				url: url[0],
				date_of_publication: data[3],
				headline: url[1],
				main_text: text,
				reports: [
					{
						event_date: 	data[3],
						locations:	[{country: data[5], location: data[7]}],
						diseases:	[d],
						syndromes:	s === ''? [] : [s],
					}
				]
			}

		})
		.catch(console.error)
}
function parseDisease(disease){
	for (var i =0 ; i < diseases.length; i++) {
		if (diseases[i].equiv.includes(disease.toLowerCase())){
			return diseases[i].name
		}
	}
	return "other"
}
function parseSyndrome(syndrome){
	for (var i =0 ; i < syndromes.length; i++) {
		if (syndromes[i].equiv.includes(syndrome.toLowerCase())){
			return syndromes[i].name
		}
	}
	return ''
}
