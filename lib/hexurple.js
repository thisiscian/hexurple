var Hexurple=function Hexurple(properties){
	var this_=this;
	this.mouse={a:{x:-100,y:-100},r:{X:-10,Y:-10},h:{X:-100,Y:-100}}
	this.mines=[]
	this.selected=[]
	this.tiles={}
	this.tileCount=0
	this.game_over=false;	
	Game.call(this,properties)
	
	document.body.appendChild(this.context.canvas);
	this.renders=[]
	this.draws=[
		this.drawHexurple,
	]
	this.needs_rendering=Object.keys(this.renders)

	this.choices=[
		['black',this.context.hex.toHex(2,+2), true],
		['purple',this.context.hex.toHex(0,+3), undefined],
		['red',this.context.hex.toHex(-2,+4), true],
		['black',this.context.hex.toHex(4,+1), undefined],
		['red',this.context.hex.toHex(-4,+5), undefined],
	]
	
	this.big=this.context.hex.toHex(0,-1)

	this.selected='nothing'
	this.speed=2000
	this.reset()
};

Hexurple.prototype=Object.create(Game.prototype,{
	constructor: {value: Hexurple},
	default_properties: {value:{
		name      : 'Hexurple',
		radius    : 3,
		minesRatio: 0.22,
		hexRadius :'auto',
		rescale   :0.75,
		background:'#F1F1D4',
	}},
	
	renderHex:{value:function(colour,pos,doub,scale,angle) {
		if(typeof(scale)==='undefined')scale=1;
		this.context.hex.strokeStyle=colour
		this.context.hex.strokeHexagon(pos,scale,0,6,angle)
		if(typeof(doub)!=='undefined')
			this.context.hex.strokeHexagon(pos,0.6*scale,0,6,angle)
	}},

	render:{value:function() { 
		this.context.clear()
		var render_again=[]
		for(var i in this.needs_rendering) {
			this.renders[this.needs_rendering[i]].call(this);
		}
		for(var i in this.draws) {
			if(this.draws[i].call(this,this.context.context))
				render_again.push(i)
		}
		this.needs_rendering=render_again
	}},

	drawHexurple:{value:function(){
		if(this.selected!='nothing') {
			this.context.hex.globalAlpha=0.5
			this.renderHex.apply(this,this.choices[this.selected[0]].concat([1.5]))
			this.context.hex.globalAlpha=1

			this.context.hex.strokeStyle=this.choices[this.selected[0]][0]
			var dt=new Date()-this.selected[1]
			var angle=4*Math.PI*Math.sin(0.5*Math.PI*dt/this.speed)
			var arr=[]
			if(dt>this.speed) {
				for(var i=0; i<3; i++)
					arr[i]=this.final_set[i]	
				angle=0
			} else {
				var j=Math.floor(dt/100)%5
				for(var i=0; i<3; i++) {
					arr[i]=this.choices[j][i]
				}
			}
			arr[1]=this.big
			this.renderHex.apply(this,arr.concat([4,angle]))
		}

		for(var i in this.choices)
			this.renderHex.apply(this,this.choices[i])
	
	}},

	reset:{value:function(){
		this.needs_rendering=Object.keys(this.renders)
		this.selected='nothing'
	}},

	onMouseUpAfter:{value:function(ev){
		var a=this.context.a.toAbs(ev.layerX,ev.layerY)
		var h=this.context.a.toHex(a,this.context.h.rescale,this.context.h.hexRadius)

		if(new Date()-this.selected[1]>this.speed)
			this.reset()	

		var t=h.toString()

		if(this.selected=='nothing') {
			for(var i=0; i<this.choices.length; i++)
				if(t==this.choices[i][1].toString())
					this.selected=[i,new Date()]

			if(this.selected[0]>2)
				this.final_set=this.choices[3+Math.round(Math.random())]
			else
				this.final_set=this.choices[Math.round(Math.random())+Math.round(Math.random())]
		} 
	}},
});
