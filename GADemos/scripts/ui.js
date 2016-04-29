"use strict";

var container;
var textBoxes = [];
var menus = [];

var TextBox = function(text) {
    this.text = text;
	this.menu = undefined;
    this.next = undefined;
    this.element = undefined;
    this.event = undefined;
};
Object.seal(TextBox);

TextBox.prototype.display = function() {
    this.element.innerHTML = this.text;
    this.element.classList.remove('hidden');
    this.event && this.event();
};

TextBox.prototype.hide = function() {
    this.element.classList.add('hidden');
}

TextBox.prototype.progress = function() {
    if(this.menu) this.menu.hide();
	else this.hide();
	this.next.element.onclick = this.next.progress ? this.next.progress.bind(this.next) : undefined;
    this.next.display();
    return this.next;
};

var Menu = function() {
    this.options = [];//options are textboxes
	this.element = document.createElement('div');//just a container for the menu options
	this.element.classList.add('menuContainer');
};
Object.seal(Menu);

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
    //create the elements for the textbox chains
    textBoxes[0] = createTextBoxElement(false); 
    textBoxes[1] = createTextBoxElement(false);
    
    var menu = new Menu();
	menu.options = [ 
		new TextBox('Cody'), 
		new TextBox('JAJ') 
	];
	menu.options[0].next = menu.createTextBoxChain([ 
		new TextBox('is'), new TextBox('AMAAAAZING') 
	]);
	menu.options[1].next = menu.createTextBoxChain([ 
		new TextBox('is pretty much'), new TextBox('A TERRIBLE TEACHER'), 
		new TextBox('but'), new TextBox('he tries')
	]);
	menu.options.forEach(function(el, i) { 
		menu.options[i].menu = menu;
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