var casper = require('casper').create({
    colorizerType: 'Dummy',
	verbose: true,
    pageSettings: {
        loadImages: false,
        loadPlugins: true,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36 OPR/56.0.3051.36'
    },
   clientScripts: [
			'_jq_.js',
			'csvExport.js',
			'_main_.js'
		],
   viewportSize: {
        width: 1600,
        height: 900
    }
}),

    x = require('casper').selectXPath,
    _SEP_ = ",",
    fs = require('fs'),
    start = Date.now(),
    mainSelector = "/html/body/center/div/div/div/table/tbody/tr[2]",
    index = 0,
    input = '',
    sys = require('system'),
    formIndex = 1,
    kind = 'I';

var application = {
       global: {
           url: "http://www.bulkblacklist.com/",
           domains: [],
           blackListResult: [],
           currentValue: ""
       },
       init: function() {
           var self = this;
           self.getData();
       }, 
       getData: function() {
           formIndex = casper.cli.get('kind') == "domains" ? 2 : 1;
           kind = formIndex == 2 ? 'D' : 'I';
           application.global.dataFile = casper.cli.get('kind') + ".txt";
           application.getdomains();
       },
       getdomains: function() {
           var self = this;
           var details = fs.read(application.global.dataFile).split("\n");
           for (var i = 0; i < details.length; i++) {

               if (details[i] != "") {
                   application.global.domains.push(details[i]);
               }
           }
           application.testLogin();
       },
       isListed: function(target){
          if(target !== "images/g.png"){
             return "Listed";
          }
          return "";
       }
       ,
       testLogin: function() {
           casper.options.waitTimeout = 50000;     
           casper.start();
           casper.then(function() {
              
           this.eachThen(application.global.domains, function(cred) {
                    var seconds = new Date().getTime() / 1000;
                    var time_now = seconds;
                    while ((time_now + 1) > seconds)
                    {
                        seconds = new Date().getTime() / 1000;
                    }
                     application.global.currentValue = cred.data;

                     this.thenOpen(application.global.url, function(){
                     
                     this.echo("");
                     this.echo("Processing: " + application.global.currentValue, "INFO");
                     
                    
                    this.echo("kind: " + kind);
                    
                    if(kind == 'D') {
                        casper.waitForSelector(x('/html/body/center/div/form/textarea'), function() {
                            this.echo("send keys.. " + application.global.currentValue, "INFO");
                            this.sendKeys(x('/html/body/center/div/form/textarea'), application.global.currentValue);
                         }, function onTimeout() {
                            this.echo("timeout: " + application.global.currentValue, "INFO");
                         });

                         casper.waitForSelector(x('/html/body/center/div/form/textarea'), function() {
                            this.click(x('/html/body/center/div/form/input'));
                         });

                    } else {
                        casper.waitForSelector(x('/html/body/center/div/div/div/form/textarea'), function() {
                            this.sendKeys(x('/html/body/center/div/div/div/form/textarea'), application.global.currentValue);
                         }, function onTimeout() {
                            this.echo("timeout: " + application.global.currentValue, "INFO");
                         });

                         casper.waitForSelector(x('/html/body/center/div/form/textarea'), function() {
                            this.click(x('/html/body/center/div/div/div/form/input'));
                         });
                    }
                     casper.waitForSelector(x(mainSelector + '/td[4]'),
                         function success() {
                        
                              var blackListsIPs = '';
                              var blackListsDomains = '';
                        
                              if(formIndex == 1){
                                 
                                 var _ptr_record_ = this.fetchText(x(mainSelector + '/td[3]'));
                                 
                                 var sh = application.isListed(this.fetchText(x('/html/body/center/div/div/div/table/tbody/tr[2]/td[5]/a/img/@src')));
                                 var bc = application.isListed(this.fetchText(x('/html/body/center/div/div/div/table/tbody/tr[2]/td[6]/img/@src')));
                                 var sc = application.isListed(this.fetchText(x('/html/body/center/div/div/div/table/tbody/tr[2]/td[4]/a/img/@src')));
                                 
                                 
                                 if(sh == "Listed") { blackListsIPs += ' - Spamhaus'; }
                                 if(bc == "Listed") { blackListsIPs += ' - Barracuda'; }
                                 if(sc == "Listed") { blackListsIPs += ' - SpamCop'; }
                                 
                                 
                                 //this.capture('D:/WorkSpace/Tools/screenshots/TB.png')
                                 
                                 this.echo(blackListsIPs);
                                 
                                 if(blackListsIPs !== ''){
                                    var value = application.global.currentValue + " (RDNS: )" + _ptr_record_ + blackListsIPs;
                                    fs.write('ListedIPs.txt', value, "a");
                                    index++;
                                 }
                                 
                              } else {
                                 
                                 var a_record = this.fetchText(x(mainSelector + '/td[3]'));
                                 var Spamhaus = application.isListed(this.fetchText(x(mainSelector + '/td[4]/img/@src')));
                                 var HostKarmer = application.isListed(this.fetchText(x(mainSelector + '/td[5]/img/@src')));
                                 var SpamCop = application.isListed(this.fetchText(x(mainSelector + '/td[6]/img/@src')));
                                 var OutBlaze = application.isListed(this.fetchText(x(mainSelector + '/td[7]/img/@src')));
                                 var AbuseButler = application.isListed(this.fetchText(x(mainSelector + '/td[8]/img/@src')));
                                 var Joewein = application.isListed(this.fetchText(x(mainSelector + '/td[9]/img/@src')));
                                 var URIBL = application.isListed(this.fetchText(x(mainSelector + '/td[10]/img/@src')));

                                 if(Spamhaus == "Listed") { blackListsDomains += ' - Spamhaus'; }
                                 if(HostKarmer == "Listed") { blackListsDomains += ' - HostKarmer'; }
                                 if(SpamCop == "Listed") { blackListsDomains += ' - SpamCop'; }
                                 if(OutBlaze == "Listed") { blackListsDomains += ' - OutBlaze'; }
                                 if(AbuseButler == "Listed") { blackListsDomains += ' - AbuseButler'; }
                                 if(Joewein == "Listed") { blackListsDomains += ' - Joewein'; }
                                 if(URIBL == "Listed") { blackListsDomains += ' - URIBL'; }
                                 
                                 if(blackListsDomains !== ''){
                                    var value = application.global.currentValue + blackListsDomains + ' ' + a_record;
                                    fs.write('ListedDomains.txt', value + "\n", "a");
                                    index++;
                                 }
                                 
                              }
                         },
                         function fail() {
                             casper.echo("#Oops!", "ERROR");
                         }
                     );
                      
                   });
                  casper.clear();
                  phantom.clearCookies();
               });
              
              this.echo("");
           });
           casper.then(function(){
               this.echo("");
               casper.echo((index > 0 ? index + (kind == 'I' ? " IP" : " Domain") + "(s) listed!" : "No domains listed!") + " | time elapsed: " + (Date.now() - start) + "(ms)");
           });
          casper.run();
       }
};
application.init();
