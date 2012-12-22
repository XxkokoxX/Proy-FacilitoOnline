var iSlideShow = new Class.create();

iSlideShow.prototype = {
	
	initialize : function (oArgs){
		this.wait 		= oArgs.wait ? oArgs.wait : 4000;
		this.duration		= oArgs.duration ? oArgs.duration : 0.5;
		this.container 		= oArgs.container ? oArgs.container : 'websites-images';
		this.imgWrapper		= oArgs.imgWrapper? oArgs.imgWrapper : 'websites-images-item';
		this.findSlides();
		this.start 		= 0;
		this.counter		= oArgs.counter;
		this.caption		= oArgs.caption;
		this.iImageId		= this.start;
		this.startSlideShow();
	},
	findSlides: function(){
		var slidesAux = $(this.container).select('.'+this.imgWrapper);
		this.slides = new Array();
		for (var i = 0; i < slidesAux.length; i++){
			var aux = slidesAux[i];
			this.slides[(slidesAux.length -1 )- i] = aux.id;	
		}
		this.numOfImages = this.slides.length;
	},	
	swapImage: function (x,y) {		
		$(this.slides[x]) && $(this.slides[x]).appear({ duration: this.duration });
		$(this.slides[y]) && $(this.slides[y]).fade({duration: this.duration });
	},
	startSlideShow: function () {
		this.play = setInterval(this.play.bind(this),this.wait);
		//this.updatecounter();
									
	},
	play: function () {
		
		var imageShow, imageHide;
	
		imageShow = this.iImageId+1;
		imageHide = this.iImageId;
		
		if (imageShow == this.numOfImages) {
			this.swapImage(0,imageHide);	
			this.iImageId = 0;					
		} else {
			this.swapImage(imageShow,imageHide);			
			this.iImageId++;
		}
		
		this.textIn = this.iImageId+1 + ' of ' + this.numOfImages;
		this.updatecounter(imageShow == this.numOfImages?1:imageShow+1, imageHide+1);
	},
	
	stop: function  () {
		clearInterval(this.play);				
	},
	
	goNext: function () {
		clearInterval(this.play);
		
		var imageShow, imageHide;
	
		imageShow = this.iImageId+1;
		imageHide = this.iImageId;
		
		if (imageShow == this.numOfImages) {
			this.swapImage(0,imageHide);	
			this.iImageId = 0;					
		} else {
			this.swapImage(imageShow,imageHide);			
			this.iImageId++;
		}
	
		this.updatecounter();
	},
	
	goPrevious: function () {
		clearInterval(this.play);
	
		var imageShow, imageHide;
					
		imageShow = this.iImageId-1;
		imageHide = this.iImageId;
		
		if (this.iImageId == 0) {
			this.swapImage(this.numOfImages-1,imageHide);	
			this.iImageId = this.numOfImages-1;		
			
			//alert(NumOfImages-1 + ' and ' + imageHide + ' i=' + i)
						
		} else {
			this.swapImage(imageShow,imageHide);			
			this.iImageId--;
			
			//alert(imageShow + ' and ' + imageHide)
		}
		
		this.updatecounter();
	},
	
	updatecounter: function (imageShow, imageHide) {
		if ($('dot-item-'+imageShow)){
			$('dot-item-'+imageShow).removeClassName('image-dot-inactive');
			$('dot-item-'+imageShow).addClassName('image-dot-active');
		}
		if ($('dot-item-'+imageHide)){
			$('dot-item-'+imageHide).removeClassName('image-dot-active');
			$('dot-item-'+imageHide).addClassName('image-dot-inactive');
		}
	}
}
