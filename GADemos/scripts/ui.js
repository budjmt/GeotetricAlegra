"use strict";

var textBoxes = [];
var menus = [];

var TextBox = function(text) {
    this.text = text;
    this.next = undefined;
    this.element = undefined;
    this.event = undefined;
    this.onclick = this.progress;
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
    this.hide();
    this.next.display();
    return this.next;
};

var Menu = function() {
    this.textBoxes = [];
};
Object.seal(Menu);

Menu.prototype.display = function() {
    this.textBoxes.forEach(function(el, i) {
        this.textBoxes[i].display();
    });
};

Menu.prototype.hide = function() {
    this.textBoxes.forEach(function(el, i) {
        this.textBoxes[i].hide();
    });
};

//set the value of next for the menu item whose result you want to be this chain 
//to the return value of this function
Menu.prototype.createTextBoxChain = function(textBoxChain) {
    textBoxChain.forEach(function(el, i) {
        textBoxChain[i].element = textBoxes[i % 2]; 
        textBoxChain[i].next = textBoxChain[i + 1]; 
    });
    textBoxChain[textBoxChain.length - 1].next = this;
    return textBoxes[0];
};

function createTextBoxElement() {
    var box = document.createElement('div');
    box.classList.add('textBox');
    return box;
}

function setupUI() {
    //create the elements for the textbox chains
    textBoxes[0] = createTextBoxElement(); 
    textBoxes[1] = createTextBoxElement();
    
    var menu = new Menu(); 
}