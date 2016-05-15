"use strict";

var container;
var textBoxes = [];
var menus = [];

function TextBox(text, event) {
    this.text = text;
	this.menu = undefined;
    this.next = undefined;
    this.element = undefined;
    this.event = event;
};

TextBox.prototype.display = function() {
    this.element.innerHTML = '<p>' + this.text + '</p>';
    this.element.classList.remove('hidden');
    this.event && this.event();
};

TextBox.prototype.hide = function() {
    this.element.classList.add('hidden');
}

TextBox.prototype.progress = function(e) {
    if(this.menu) this.menu.hide();
	else this.hide();
	this.next.element.onclick = this.next.progress ? 
        this.next.progress.bind(this.next) : undefined;
    this.next.display();
    return this.next;
};

function Menu() {
    this.options = [];//options are textboxes
	this.element = document.createElement('div');//just a container for the menu options
	this.element.classList.add('menuContainer');
};

Menu.prototype.display = function() {
    this.options.forEach(function(el, i) {
        setTimeout(function() { this.options[i].display() }.bind(this), i * 100);
    }.bind(this));
};

Menu.prototype.hide = function() {
    this.options.forEach(function(el, i) {
		setTimeout(function() { this.options[i].hide() }.bind(this), i * 100);
    }.bind(this));
};

//set the value of next for the menu item whose result you want to be this chain 
//to the return value of this function
Menu.prototype.createTextBoxChain = function(textBoxChain) {
    for(var i = 0; i < textBoxChain.length; i++) {
        if(typeof textBoxChain[i] == 'string')
            textBoxChain[i] = new TextBox(textBoxChain[i]);
    }
    textBoxChain.forEach(function(el, i) {
        textBoxChain[i].element = textBoxes[i % 2]; 
        textBoxChain[i].next = textBoxChain[i + 1]; 
    });
    textBoxChain[textBoxChain.length - 1].next = this;
    return textBoxChain[0];
};

function createTextBoxElement(visible) {
    var box = document.createElement('div');
    box.classList.add('textBox');
	!visible && box.classList.add('hidden');
    return box;
}

function setupUI() {
    //create the elements for the textbox chains; parameter indicates visibility
    textBoxes[0] = createTextBoxElement(false); 
    textBoxes[1] = createTextBoxElement(false);
    
    var menu = new Menu();
	menu.options = [ 
		new TextBox('Cody'), 
		new TextBox('This is the Land'), 
		new TextBox('Geometric Algebra Basics')
	];
    
	menu.options[0].next = menu.createTextBoxChain([ 
		'is', new TextBox('AMAAAAZING', cody)
	]);
	menu.options[1].next = menu.createTextBoxChain([ 
		'of', new TextBox('spinning cubes.', basicCube), 'Aren\'t they neat?'
	]);
	
	menu.options[2].next = menu.createTextBoxChain([
		'Looking at geometry and vector math, we deal with a lot of different constructs.',
        'Vectors, planes, areas, volumes, matrices...',
        'And with them, we have to learn a lot of different rules and ways of getting from one to another.',
        'Geometric Algebra is a way for us to interact with the myriad geometric concepts all in one uniform way.',
		
        new TextBox('This is a basis axis, which we\'ll call e<sub>1</sub>.', e1), 
        'It represents a unit vector in the direction of one of our axes, which is <b>x</b> in this case.',
        'The reason it\'s spinning around is to make the point that it doesn\'t have to point in any particular direction, ' +
		'even though we identify it with x',
        'If we were working in 1D this would be our only axis, but we can go further.',
		
        new TextBox('Here is the next basis vector for 2D, which we\'ll call e<sub>2</sub> ' +
					'or <b>y</b>, marked in blue', e2),
        new TextBox('And here, in green, is <b>z</b>, or e<sub>3</sub> for 3D.', e3),
        'The important thing to notice is that all of these vectors are "co-perpendicular", aka orthogonal.',
        
        'Going above the 3rd dimension, our basis axes are still considered to be orthogonal, ' +
        'but in a way that we can\'t perceive.',
        'Geometric Algebra allows for well-defined N-dimensional geometry, as seen in the game Miegakure.', 
        'This differs from linear algebra which works best in 3D and below and has limited effectiveness above that.',
		
        'One interesting thing about geometric algebra is that its rules also apply to scalars, aka numbers.',
        'We treat them as 0-dimensional objects, which don\'t have a concrete geometric representation.',
        'This is because of how objects are conceptualized.',
        'An N-dimensional construct in GA is an <b>n-vector</b>.',
        'We have more specific terms for the lower dimensions: ',
        '0D: scalars, 1D: vectors...',
        
        'In 2D, we have <b>bivectors</b> (which are similar to planes), ' +
        'and in 3D we have <b>trivectors</b> (which are similar to volumes)...',
        'After that, we don\'t have any specific terms and just fall back on n-vector.',
        
        'GA objects are often combinations of the various n-vectors; ' +
        'a generic GA object consisting of any number of n-vectors is a <b>multivector</b>.',
        
        new TextBox('So what actually are bi and trivectors?', clear),
        new TextBox('Here\'s a demonstration of the outer product between e<sub>1</sub> and e<sub>2</sub>, ' + 
                    'which creates the bivector e<sub>12</sub>.', outerProduct)
	]);
	
	menu.options.forEach(function(el, i) { 
		menu.options[i].menu = menu;
        menu.options[i].event = clear;
		menu.options[i].element = createTextBoxElement(true);
		menu.options[i].element.onclick = menu.options[i].progress.bind(menu.options[i]);
		menu.options[i].display();
	});
	
	menus.push(menu);
	
	container.appendChild(textBoxes[0]);
	container.appendChild(textBoxes[1]);
	menus.forEach(function(menuEl, i) {
		container.appendChild(menuEl.element);
		menuEl.options.forEach(function(boxEl, i) {
			menuEl.element.appendChild(boxEl.element);
		});
	});
}

window.addEventListener('load', function() {
	container = document.getElementById('pop_ups');
	setupUI();
});