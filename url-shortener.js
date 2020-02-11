'use strict';
let first_time = 0;
class UrlShortener {
    constructor(domain) {
    this.urls= new Object();
    this.SHORTENER_DOMAIN = domain.toLowerCase();
  }
  add(longUrl)
  {
    if((/[a-zA-z]+:\/\/[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\/?(\S\/?)*/).test(longUrl))
    {
      let regex = /([a-zA-z]+):\/\/([a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*)\/?((\S\/?)*)/;
      let matches = longUrl.match(regex);
      let scheme = matches[1];
      let ld = matches[2];
      let slash = matches[3];
      let lr = matches[4];
      let ldr = scheme.toLowerCase() + '://' + ld.toLowerCase() + '/' + lr;
      if(first_time > 0)
      {
      for(var key in this.urls)
      {
        if((String(this.urls[key].d_lurl) === String(ld).toLowerCase()) && (this.urls[key].r_lurl === lr))
        {
	        this.urls[key].active = 1;
          return {value : this.urls[key].dr_surl};
        }
      }
      }
	         first_time++;
           let rn = Math.floor(Math.random() * Math.pow(2,32));
           let id = (rn.toString(36)).toLowerCase();
           let surl = scheme + '://' + this.SHORTENER_DOMAIN + '/' + id;
           this.urls[longUrl] = {
                         s_surl : scheme.toLowerCase(),
                         r_surl : id,
                         d_lurl : ld.toLowerCase(),
                         r_lurl : lr,
                         dr_lurl : ldr,
                         dr_surl : surl,
                        active : 1,
                         count : 0
                       };
          return {value : this.urls[longUrl].s_surl + '://' + this.SHORTENER_DOMAIN + '/' + this.urls[longUrl].r_surl};
     }
    else{
    return { error: { code: 'URL_SYNTAX', message: 'URL_SYNTAX: bad url! The ' + longUrl + ' syntax is incorrect (it does not contain a :// substring or the domain is empty.'} };
    }
  }

  query(shortUrl) {
    if((/[a-zA-z]+:\/\/[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\/?(\S\/?)*/).test(shortUrl))
    {
      let regex = /([a-zA-z]+):\/\/([a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*)\/?((\S\/?)*)/;
      let matches = shortUrl.match(regex);
      let scheme = matches[1];
      let sdr = matches[0];
      let sd = matches[2];
      let sr = matches[4];
      if(String(this.SHORTENER_DOMAIN).toUpperCase() === sd.toUpperCase())
      {
    	 for(var key in this.urls)
	 {
		if((this.urls[key].r_surl === sr) && (this.urls[key].active === 1))
		{
			  this.urls[key].count++;
        return {value : scheme.toLowerCase() + '://' + this.urls[key].d_lurl + '/' + this.urls[key].r_lurl };
		}
	 }
   		return { error: { code: 'NOT_FOUND', message: 'The '+ shortUrl + ' is not currently registered for this service' } };
      }
      else
      {
   	return { error: { code: 'DOMAIN', message: 'The ' + shortUrl + ' domain is not equal to SHORTENER_DOMAIN :' + this.SHORTENER_DOMAIN } };
      }
    }
    else
    {
      return { error: { code: 'URL_SYNTAX', message: 'The ' + shortUrl + ' syntax is incorrect (it does not contain a :// substring or the domain is empty.' } };
    }
  }

  count(url) {
     if((/[a-zA-z]+:\/\/[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\/?(\S\/?)*/).test(url))
    {
      let regex = /([a-zA-z]+):\/\/([a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*)\/?((\S\/?)*)/;
      let matches = url.match(regex);
      let scheme = matches[1];
      let dr = matches[0];
      let d = matches[2];
      let r = matches[4];
    	for(var key in this.urls)
	    {
			     if(String(this.urls[key].d_lurl).toUpperCase() === d.toUpperCase())
      			{
				          if(this.urls[key].r_lurl === r)
				          {
          				       return {value : this.urls[key].count};
				          }
	 		      }
			      if(String(this.SHORTENER_DOMAIN).toUpperCase() === d.toUpperCase())
      			{
				          if(this.urls[key].r_surl === r)
				          {
          				       return {value : this.urls[key].count};
				          }
	 		      }
		  }
   	    return { error: { code: 'NOT_FOUND', message: 'The ' + url + ' is not currently registered for this service' } };
     }
     else
     {
       return { error: { code: 'URL_SYNTAX', message: 'The ' + url + ' syntax is incorrect (it does not contain a :// substring or the domain is empty.' } };
     }

  }

  remove(url)
  {
    if((/[a-zA-z]+:\/\/[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\/?(\S\/?)*/).test(url))
    {
      let regex = /([a-zA-z]+):\/\/([a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*)\/?((\S\/?)*)/;
      let matches = url.match(regex);
      let scheme = matches[1];
      let dr = matches[0];
      let d = matches[2];
      let r = matches[4];
    	for(var key in this.urls)
	    {
			     if(String(this.urls[key].d_lurl).toUpperCase() === d.toUpperCase())
      		 {
				         if(this.urls[key].r_lurl === r)
				         {
					              this.urls[key].active = 0;
          				      let value = {};
					              return {value};
				         }
	 		     }
			     if(String(this.SHORTENER_DOMAIN).toUpperCase() === d.toUpperCase())
      		 {
				         if(this.urls[key].r_surl === r)
				         {
					              this.urls[key].active = 0;
					              return {};
				         }
	 		     }
		}
   	return { error: { code: 'NOT_FOUND', message: 'The ' + url + ' is not currently registered for this service' } };
    }
     else
     {
       return { error: { code: 'URL_SYNTAX', message: 'The ' + url + ' syntax is incorrect (it does not contain a :// substring or the domain is empty.' } };
     }
}
}
//UrlShortener class as only export
module.exports = UrlShortener

//@TODO Add auxiliary functions here which do not need access to a
//UrlShortener instance; they may be called from methods without
//needing to be prefixed with `this`.
