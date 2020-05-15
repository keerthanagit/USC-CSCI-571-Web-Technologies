export function getNytimesImageUrl(result) {
    let def = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
    let ans="";
    if(result.multimedia===null || result.multimedia.length===0)
        ans=def;
    else
    {
        if(result.multimedia[0].url.startsWith("http"))
            ans=result.multimedia[0].url;
        else
            ans="https://nyt.com/"+result.multimedia[0].url;
    }
    return ans;
}

export function getGuardianImageUrl(assets) {
    let def= "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
    let ans="";
    if(assets.length===0)
        ans = def;
    else{
        let size=assets.length;
        ans = assets[size-1].file;
    }
    return ans;
}

export function getDate(d) {
    //const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    //var date=new Date(d);
    var date=d.substring(0,10);
    /*var day=null;
    //var mon=null;
    var year=null;
    var monNum=null;

    if(date.getDate()<=9)
        day="0"+date.getDate();
    else
        day=date.getDate();

    if(date.getMonth()+1 <=9)
        monNum="0" + (date.getMonth() + 1);
    else
        monNum=date.getMonth() + 1;

    //mon=month[date.getMonth()];

    year=date.getFullYear();

    return year+"-"+monNum+"-"+day;*/
    return date;
}

export function getSectionName(section) {
    let sec=section.toLowerCase();
    if(sec==="sport" || sec==="sports")
        return"SPORTS";
    return sec.toUpperCase();
}

export function getSectionStyle(sec) {
    let section= sec.toLowerCase();
    let col="";
    let bg="";
    if(section==="world")
    {
        col="#fff";
        bg="#9933ff";
    }
    else if(section==="politics")
    {
        col="#fff";
        bg="#339966";
    }
    else if(section==="business")
    {
        col="#fff";
        bg="#3399ff";
    }
    else if(section==="technology")
    {
        col="#000";
        bg="#cccc00";
    }
    else if(section==="sport" || section==="sports")
    {
        col="#000";
        bg="#ff9900";
    }
    else if(section==="guardian")
    {
        col="#fff";
        bg="#000";
    }
    else
    {
        col="#fff";
        bg="#8c8c8c";
    }

    const styles={
        color : col,
        backgroundColor : bg
    };

    return styles;
}