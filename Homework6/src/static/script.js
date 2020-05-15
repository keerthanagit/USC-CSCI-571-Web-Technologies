function openPage(evt,pageName)
{
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (var i = 0; i < tabcontent.length; i++)
	{
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (var i = 0; i < tablinks.length; i++) 
	{
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(pageName).style.display = "block";
	evt.currentTarget.className += " active";
	if(pageName=="Search")
	{
		resetForm();
	}
}
function loadJSON(url,jsonObj) 
{
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET",url,true);
	//var jsonObj=null;
	xmlhttp.onreadystatechange=function(){
		if(xmlhttp.status==200 && xmlhttp.readyState==4){
			jsonObj= JSON.parse(xmlhttp.responseText);
		}
	}
	//xmlhttp.send();						
	//return jsonObj;
	return xmlhttp;
}
function carousel()
{
	var i;
	var x = document.getElementsByClassName('slide');
	//var y=document.getElementsByClassName('slideContent');
	for (var i = 0; i < x.length; i++) {
	x[i].style.display = "none";
	//y[i].style.display = "none";
	}
	myIndex++;
	if (myIndex > x.length) {myIndex = 1}    
	x[myIndex-1].style.display = "block";
	//y[myIndex-1].style.display = "block";	
	setTimeout(carousel, 2000); // Change image every 2 seconds
}
function generateTopHeadlines(articles)
{
	var slidediv=document.getElementById('slideshow');
	for(var i=0;i<5;i++)
	{
		//create a hreaf for slide
		var link=document.createElement('a');
		link.setAttribute('href',articles[i].url);		
		link.setAttribute('class','cardlink');
		link.setAttribute('target','_blank');
		link.setAttribute('rel','noopener noreferrer');
		
		//create a slide div
		var fullslide=document.createElement('div');
		fullslide.setAttribute('class','slide');
		
		//add image to slide
		var image=document.createElement('img');
		image.setAttribute('src',articles[i].urlToImage);		
		image.setAttribute('style', 'diplay: none;');
		image.setAttribute('class','slides');
		fullslide.appendChild(image);
		
		//add content to slide
		var content=document.createElement('div');
		content.setAttribute('class','slideContent');
		var title=document.createElement('p');
		title.innerHTML=articles[i].title;
		title.setAttribute('class','slideTitle');
		content.appendChild(title);
		var description=document.createElement('p');
		description.innerHTML=articles[i].description;
		description.setAttribute('class','slideDescription');
		content.appendChild(description);
		fullslide.appendChild(content);
		
		link.appendChild(fullslide);
		slidediv.appendChild(link);
	}
	myIndex=0;
	carousel();
}
function generateFrequentWords(freqWords)
{
	// List of words
var myWords = freqWords;

// set the dimensions and margins of the graph
var margin = {top: 0, right: 0, bottom: 0, left: 0},
width = 550 - margin.left - margin.right,
height = 550 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#wordcloud").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("width", "100%")
	.attr("height", "100%")
	.attr("transform",
		  "translate(22,10)");

// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
// Wordcloud features that are different from one word to the other must be here
var layout = d3.layout.cloud()
	//.size([width, height])
	.words(myWords.map(function(d) { return {text: d[0], size: Math.min((d[1] * 8) + 2, 30)/*5+(d[1]*5)*/, test: "haha"}; }))
	.padding(3)        //space between words
	.rotate(function() { return ~~(Math.random() * 2) * 90; })
	.fontSize(function(d) { return d.size; })      // font size of words
	.on("end", draw);
	layout.start();
	
	function draw(words) {
	  svg
		.append("g")
		  .attr("width", 257)
		  .attr("height", 260)
		  //.attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
		  .attr("transform", "translate(110,130)")
		  .selectAll("text")
			.data(words)
			  .enter().append("text")
				.style("font-size", function(d) { return d.size + "px"; })
				.style("fill", "black")
				.attr("text-anchor", "middle")
				.style("font-family", "Impact")
				.attr("transform", function(d) {
				  return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
				})
				.text(function(d) { return d.text; });
	}
}
function generateCnnCards(articles)
{
	var cnndiv=document.getElementById('cnnnews');
	for(var i=0;i<Math.min(articles.length,4);i++)
	{
		var link=document.createElement('a');
		link.setAttribute('href',articles[i].url);		
		link.setAttribute('class','cardlink');
		link.setAttribute('target','_blank');
		link.setAttribute('rel','noopener noreferrer');
		var card=document.createElement('div');
		card.setAttribute('class','cardcol');
		//create image div
		var image=document.createElement('img');
		image.setAttribute('src',articles[i].urlToImage);
		image.setAttribute('class','cardimg');
		
		card.appendChild(image);
		
		//create content div
		var content=document.createElement('div');
		content.setAttribute('class','cardContent');
		var title=document.createElement('p');
		title.innerHTML=articles[i].title;
		title.setAttribute('class','cardTitle');
		content.appendChild(title);
		var description=document.createElement('p');
		description.innerHTML=articles[i].description;
		description.setAttribute('class','cardDescription');
		content.appendChild(description);
		
		card.appendChild(content);
		
		link.appendChild(card);		
		cnndiv.appendChild(link);
	}
	
}
function generateFoxCards(articles)
{
	var foxdiv=document.getElementById('foxnews');
	for(var i=0;i<Math.min(articles.length,4);i++)
	{
		var link=document.createElement('a');
		link.setAttribute('href',articles[i].url);
		link.setAttribute('class','cardlink');		
		link.setAttribute('target','_blank');
		link.setAttribute('rel','noopener noreferrer');
		var card=document.createElement('div');
		card.setAttribute('class','cardcol');
		//create image div
		var image=document.createElement('img');
		image.setAttribute('src',articles[i].urlToImage);
		image.setAttribute('class','cardimg');
		
		card.appendChild(image);
		
		//create content div
		var content=document.createElement('div');
		content.setAttribute('class','cardContent');
		var title=document.createElement('p');
		title.innerHTML=articles[i].title;
		title.setAttribute('class','cardTitle');
		content.appendChild(title);
		var description=document.createElement('p');
		description.innerHTML=articles[i].description;
		description.setAttribute('class','cardDescription');
		content.appendChild(description);
		
		card.appendChild(content);
		link.appendChild(card);		
		foxdiv.appendChild(link);
	}
	
}
function resetForm()
{
	document.getElementById('keyword').value="";
	var from=new Date();
	from.setDate(from.getDate()-7);
	document.getElementById('from').value=formatDate(from);
	var to=new Date();
	document.getElementById('to').value=formatDate(to);
	document.getElementById('category').value="all";
	generateSources();
	document.getElementById('SearchResults').innerHTML="";
	document.getElementById('showmore').setAttribute('style','display:none;');
	document.getElementById('showless').setAttribute('style','display:none;');
}
function areDatesValid()
{
    var from_date=document.getElementById('from');
    var to_date=document.getElementById('to');
    var from=new Date(from_date.value);
    var to=new Date(to_date.value);
    var today=new Date();
    if(to<from || from>today || to>today )
        return false;
    else
        return true;
}
function formatDate(date)
{
	var day=null;
	var month=null;
	var year=null;
	if(date.getDate()<=9)
		day="0"+date.getDate();
	else
		day=date.getDate();
	
	if(date.getMonth()+1<=9)
		month="0"+(date.getMonth()+1);
	else
		month=date.getMonth()+1;
	year=date.getFullYear();
	
	return year+"-"+month+"-"+day;
}
function formatDateSlash(date)
{
	var day=null;
	var month=null;
	var year=null;
	if(date.getDate()<=9)
		day="0"+date.getDate();
	else
		day=date.getDate();

	if(date.getMonth()+1<=9)
		month="0"+(date.getMonth()+1);
	else
		month=date.getMonth()+1;
	year=date.getFullYear();

	return month+"/"+day+"/"+year;
}
function generateSources()
{
	var sel = document.getElementById('category').value;
	
	//var opt = sel.options[sel.selectedIndex];
	var baseUrl="/sources/";
	//var result=loadJSON(baseUrl+sel);
		
		var xmlhttp4=new XMLHttpRequest();
		xmlhttp4.open("GET",baseUrl+sel,true);
		//var headlinesObj=null;
		xmlhttp4.onreadystatechange=function(){
			if(xmlhttp4.status==200 && xmlhttp4.readyState==4){
				var result= JSON.parse(xmlhttp4.responseText);
				var sources=result.sources;
				var src_element=document.getElementById('source');
				src_element.innerHTML="";
				var opt= document.createElement('option');
				opt.value='all';
				opt.innerHTML = 'all';
				src_element.appendChild(opt);
				//var index=0;
				for(var i=0;i<sources.length;i++)
				{
					var opt= document.createElement('option');					
					opt.value= sources[i].id;
					opt.innerHTML = sources[i].name; // whatever property it has
							

					// then append it to the select element
					src_element.appendChild(opt);
					//index++;
				}	
			}
		}
	xmlhttp4.send();
		
}
function resetSearchCard(searchcard)
{
	var content=null;
	for(var i=0;i<searchcard.childNodes.length;i++)
	{
		if (searchcard.childNodes[i].className == "searchcontent")
		{
			content = searchcard.childNodes[i];
			break;
		}   
	}
	var img=null;
	for(var i=0;i<searchcard.childNodes.length;i++)
	{
		if (searchcard.childNodes[i].className == "searchimg")
		{
			img = searchcard.childNodes[i];
			break;
		}   
	}
	img.setAttribute('style','padding-bottom:30px;');
	var desc=null;
	for(var i=0;i<content.childNodes.length;i++)
	{
		if (content.childNodes[i].className == "searchDescription")
		{
			desc = content.childNodes[i];
			break;
		}   
	}
	desc.setAttribute('style','display:block;');
	var alt_desc=null;
	for(var i=0;i<content.childNodes.length;i++)
	{
		if (content.childNodes[i].className == "searchDescriptionAlt")
		{
			alt_desc = content.childNodes[i];
			break;
		}   
	}
	alt_desc.setAttribute('style','display:none;');
	var cross=null;
	for(var i=0;i<content.childNodes.length;i++)
	{
		if (content.childNodes[i].className == "cross")
		{
			cross = content.childNodes[i];
			break;
		}   
	}
	cross.setAttribute('style','display:none;');
	content.setAttribute('style','height:150px;');
	event.stopPropagation();
}
function openSearchCard(searchcard)
{
	var content=null;
	for(var i=0;i<searchcard.childNodes.length;i++)
	{
		if (searchcard.childNodes[i].className == "searchcontent")
		{
			content = searchcard.childNodes[i];
			break;
		}   
	}
	/*var cross=document.createElement('button');
	cross.setAttribute('id','cross');
	cross.innerHTML="&times;";
	cross.setAttribute('onclick','resetSearchCard(this.parentElement.parentElement)');
	content.appendChild(cross);*/
	var img=null;
	for(var i=0;i<searchcard.childNodes.length;i++)
	{
		if (searchcard.childNodes[i].className == "searchimg")
		{
			img = searchcard.childNodes[i];
			break;
		}   
	}
	img.setAttribute('style','padding-bottom:95px;');
	var desc=null;
	for(var i=0;i<content.childNodes.length;i++)
	{
		if (content.childNodes[i].className == "searchDescription")
		{
			desc = content.childNodes[i];
			break;
		}   
	}
	desc.setAttribute('style','display:none;');
	var alt_desc=null;
	for(var i=0;i<content.childNodes.length;i++)
	{
		if (content.childNodes[i].className == "searchDescriptionAlt")
		{
			alt_desc = content.childNodes[i];
			break;
		}   
	}
	alt_desc.setAttribute('style','display:block;');
	var cross=null;
	for(var i=0;i<content.childNodes.length;i++)
	{
		if (content.childNodes[i].className == "cross")
		{
			cross = content.childNodes[i];
			break;
		}   
	}
	cross.setAttribute('style','display:block;');
	content.setAttribute('style','height:auto;')	
	/*desc.innerHTML="";
	desc.innerHTML+="<span clas='searchkey'>Author:</span><span class='searchvalue'>By "+article.author+"</span><br/>";
	desc.innerHTML+="<span clas='searchkey'>Source:</span><span class='searchvalue'> "+article.source.name+"</span><br/>";
	var date=new Date(article.publishedAt);
	var d=date.getMonth() + 1+"/"+date.getDate()+"/"+date.getFullYear();
	desc.innerHTML+="<span clas='searchkey'>Date:</span><span class='searchvalue'> "+d+"</span><br/>";
	desc.innerHTML+=article.description;
	desc.innerHTML+="<a href="+article.url+">See Original Post</a>";*/
	
	
}
function getLineDescription(description)
{
    var max_letters=70;
	var temp="";
	if(description.length>max_letters)
	{
		temp=description.substring(0,max_letters);
	}
	else
	{
		temp=description;
	}
	temp=temp.substr(0,temp.lastIndexOf(" "))+"...";
	return temp;
	
}
function populateSearchData(articles)
{
	var searchdiv=document.getElementById('SearchResults');	
	searchdiv.innerHTML="";
	if(articles.length==0)
	{
		var text=document.createElement('p');
		text.innerHTML="No results";
		text.setAttribute('style','text-align:center;');
		searchdiv.appendChild(text);
		document.getElementById('showmore').setAttribute('style','display:none;');
		document.getElementById('showless').setAttribute('style','display:none;');
	}
	else
	{
		var flag=false;
		for(var i=0;i<Math.min(articles.length, 15);i++)
		{		
			/*var hyper_link=document.createElement('a');
			hyper_link.setAttribute('href',articles[i].url);
			hyper_link.setAttribute('class','searchlink');		
			hyper_link.setAttribute('target','_blank');
			hyper_link.setAttribute('rel','noopener noreferrer');*/
			var card=document.createElement('div');
			card.setAttribute('class','searchresult');
			//create image div
			var image=document.createElement('img');
			image.setAttribute('src',articles[i].urlToImage);
			image.setAttribute('class','searchimg');
			
			card.appendChild(image);
			
			//create content div
			var content=document.createElement('div');
			content.setAttribute('class','searchcontent');
			var title=document.createElement('p');
			title.innerHTML=articles[i].title;
			title.setAttribute('class','searchTitle');
			content.appendChild(title);
			var description=document.createElement('p');
			//var span=document.createElement('span');
			//span.innerHTML=articles[i].description;
			//span.setAttribute('class','dotspan');
			//description.appendChild();
			description.innerHTML=getLineDescription(articles[i].description);
			description.setAttribute('class','searchDescription');
			content.appendChild(description);
			
			var desc=document.createElement('p');
			
			desc.innerHTML="";
			desc.innerHTML+="<span class='searchkey'>Author:</span><span class='searchvalue'> "+articles[i].author+"</span><br/>";
			desc.innerHTML+="<span class='searchkey'>Source:</span><span class='searchvalue'> "+articles[i].source.name+"</span><br/>";
			var date=new Date(articles[i].publishedAt);
			var d=formatDateSlash(date);
			desc.innerHTML+="<span class='searchkey'>Date:</span><span class='searchvalue'> "+d+"</span><br/>";
			desc.innerHTML+=articles[i].description+"<br/>";
			desc.innerHTML+="<a class='postlink' target='_blank' rel='noopener noreferrer' href="+articles[i].url+">See Original Post</a>";
			
			desc.setAttribute('class','searchDescriptionAlt');
			desc.setAttribute('style','display:none;');
			content.appendChild(desc);
			
			var cross=document.createElement('button');
			cross.setAttribute('class','cross');
			cross.innerHTML="&times;";
			cross.setAttribute('onclick','resetSearchCard(this.parentElement.parentElement)');
			cross.setAttribute('style','display:none;');
			content.appendChild(cross);
			
			card.appendChild(content);
			card.setAttribute('onclick',"openSearchCard(this)");
			
			if(i>=5)
			{
				card.setAttribute('style','display:none;');
				flag=true;
			}
			searchdiv.appendChild(card);
			
		}
		if(flag)
		{
			document.getElementById('showmore').setAttribute('style','display:block;');
			document.getElementById('showless').setAttribute('style','display:none;');
		}
	
	}
	
}
function addSearchResults()
{
	var searchresults=document.getElementsByClassName('searchresult');
	for(var i=0;i<searchresults.length;i++)
	{
		searchresults[i].setAttribute('style','display:block;');
	}
	document.getElementById('showmore').setAttribute('style','display:none;');
	document.getElementById('showless').setAttribute('style','display:block;');
}
function hideSearchResults()
{
	var searchresults=document.getElementsByClassName('searchresult');
	for(var i=5;i<searchresults.length;i++)
	{
		searchresults[i].setAttribute('style','display:none;');
	}
	document.getElementById('showmore').setAttribute('style','display:block;');
	document.getElementById('showless').setAttribute('style','display:none;');
}
function getSearchData()
{
    if(!areDatesValid())
    {
        alert("Incorrect time");
    }
    else
    {
        var keyword=document.getElementById('keyword').value;
        var from_date=document.getElementById('from');
        var to_date=document.getElementById('to');
        var category=document.getElementById('category').value;
        var source=document.getElementById('source').value;
        //var query_string="keyword="+keyword+"&source="+source+"&from_date="+formatDate(new Date(from_date.value))+"&to_date="+formatDate(new Date(to_date.value));
        var query_string="keyword="+keyword+"&source="+source+"&from_date="+from_date.value+"&to_date="+to_date.value;
        var baseUrl="http://127.0.0.1:5000/searchresults?";
        //var result=loadJSON(baseUrl+query_string);
        //populateSearchData(result.articles);

        var xmlhttp5=new XMLHttpRequest();
            xmlhttp5.open("GET",baseUrl+query_string,true);
            //var headlinesObj=null;
            xmlhttp5.onreadystatechange=function(){
                if(xmlhttp5.status==200 && xmlhttp5.readyState==4){
                    var result= JSON.parse(xmlhttp5.responseText);
                    if(result!=null && result.hasOwnProperty("status") && result.status=="ok")
                    {
                       populateSearchData(result.articles);
                    }
                    else
                    {
                        alert(result.message);
                    }
                }
            }
            xmlhttp5.send();
    }
	return false;
}
function loadPage()
{
	var baseUrl="http://127.0.0.1:5000/";
	var headlinesPath = "headlines";
	var cnnPath="cnn";
	var foxPath="fox";
	
	/*-----------------------HEADLINES--------------------------------*/
	//call headlines
		var xmlhttp1=new XMLHttpRequest();
		xmlhttp1.open("GET",baseUrl+headlinesPath,true);
		//var headlinesObj=null;
		xmlhttp1.onreadystatechange=function(){
			if(xmlhttp1.status==200 && xmlhttp1.readyState==4){
				var headlinesObj= JSON.parse(xmlhttp1.responseText);
				generateTopHeadlines(headlinesObj.articles);
				generateFrequentWords(headlinesObj.frequentWords);
			}
		}
		xmlhttp1.send();
	//end headlines
	
	/*-----------------------CNN NEWS--------------------------------*/
	//call cnnnews
		var xmlhttp2=new XMLHttpRequest();
		xmlhttp2.open("GET",baseUrl+cnnPath,true);
		//var cnnNewsObj=null;
		xmlhttp2.onreadystatechange=function(){
			if(xmlhttp2.status==200 && xmlhttp2.readyState==4){
				var cnnNewsObj= JSON.parse(xmlhttp2.responseText);
				generateCnnCards(cnnNewsObj.articles);
			}
		}
		xmlhttp2.send();
	//end cnnnews
	
	/*-----------------------FOX NEWS--------------------------------*/
	//call foxnews
		xmlhttp3=new XMLHttpRequest();
		xmlhttp3.open("GET",baseUrl+foxPath,true);
		//var foxNewsObj=null;
		xmlhttp3.onreadystatechange=function(){
			if(xmlhttp3.status==200 && xmlhttp3.readyState==4){
				var foxNewsObj= JSON.parse(xmlhttp3.responseText);
				generateFoxCards(foxNewsObj.articles);
			}
		}
		xmlhttp3.send();
	//end foxnews
	
	/*var cnnNewsObj=loadJSON(baseUrl+cnnPath);
	var foxNewsObj=loadJSON(baseUrl+foxPath);
	generateTopHeadlines(headlinesObj.articles);
	generateFrequentWords(headlinesObj.frequentWords);
	generateCnnCards(cnnNewsObj.articles);
	generateFoxCards(foxNewsObj.articles);	*/
}