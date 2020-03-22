const axios = require('axios');
const cheerio = require('cheerio');
const base_url = 'http://outbreaks.globalincidentmap.com/';
const fs = require('fs');
const database = require('../common/db');

let diseases = JSON.parse(fs.readFileSync('../data/disease_list.json'));
let syndromes = JSON.parse(fs.readFileSync('../data/syndrome_list.json'));

database().then((db) => {
	// Grab the page
	axios(base_url).then(response => {
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
		res.forEach(async (article) => {
			try {
				await db.addArticle(article);
			} catch (e) {
				console.error(e);
			}
		});

		fs.writeFile("../data/output.json", JSON.stringify(res, null, 2), 'utf8', err => {
			if (err){
				console.log("[ERROR] Failed to write output.json")
				return console.log(err);
			}
			console.log("[LOG] Saved output to output.json")
			const fs = require('fs');
			
			let date_ob = new Date();

			// current date
			// adjust 0 before single digit date
			let date = ("0" + date_ob.getDate()).slice(-2);
			
			// current month
			let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
			
			// current year
			let year = date_ob.getFullYear();
			
			// current hours
			let hours = date_ob.getHours();
			
			// current minutes
			let minutes = date_ob.getMinutes();
			
			// current seconds
			let seconds = date_ob.getSeconds();

			const logline = "run scraper at: " + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

			fs.appendFile('runlog.txt', logline, function (err) {
				  if (err) throw err;
				  console.log('Saved!');
			});
		})
	})
	.catch(err =>{
		console.log("[ERROR] Failed parsing base_url")
		console.log(err)
	});
}).catch((e) => {
  console.log(e);
});



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
						event_date: data[3],
						locations: [
							{
								country: data[5],
								city: data[7],
								latitude: data[9],
								longitude: data[11]
							}
						],
						diseases:	[d],
						syndromes:	s === ''? [] : [s],
					}
				]
			}

		})
		.catch(err => {
			console.log("[ERROR] Failed parsing subpage")
			console.log(err)
		})
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
