var Cloud = {
	panel: null,
	container: null,
	uploadCounter: 0,
	managerUploadCounter: 0,
	supportedTypes: ['txt','doc','rtf','log','tex','msg','text','wpd','wps','docx','page','csv','dat','tar','xml','vcf','pps','key','ppt','pptx','sdf','gbr','ged','mp3','m4a','waw','wma','mpa','iff','aif','ra','mid','m3v','e_3gp','shf','avi','asx','mp4','e_3g2','mpg','asf','vob','wmv','mov','srt','m4v','flv','rm','png','psd','psp','jpg','tif','tiff','gif','bmp','tga','thm','yuv','dds','ai','eps','ps','svg','pdf','pct','indd','xlr','xls','xlsx','db','dbf','mdb','pdb','sql','aacd','app','exe','com','bat','apk','jar','hsf','pif','vb','cgi','css','js','php','xhtml','htm','html','asp','cer','jsp','cfm','aspx','rss','csr','less','otf','ttf','font','fnt','eot','woff','zip','zipx','rar','targ','sitx','deb','e_7z','pkg','rpm','cbr','gz','dmg','cue','bin','iso','hdf','vcd','bak','tmp','ics','msi','cfg','ini','prf'],

	initPanel: function (container, id) {
		if (!container) {
			container = Cloud.container;
		} else {
			Cloud.container = container;
		}
		Cloud.panel = container;
		$(Cloud.panel).load(cloudURL.panel, {id: id});
	},

	hasType: function (extension) {
		return $.inArray(extension, this.supportedTypes) !== -1;
	}
}