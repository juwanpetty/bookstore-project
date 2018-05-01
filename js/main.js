feather.replace();
updateCartCount();

let body = document.querySelector('body');
let cart = document.querySelector('.js-cart');
let cartIcon = document.querySelector('.js-cart-icon');
let bookList = document.querySelectorAll('.feed__item');
let bookDescription = document.querySelector('.js-book-description');
let bookDescriptionOverflow = document.querySelector('.book-description-overflow');
let bookDescriptionWrapper = document.querySelector('.book-description-wrapper');
let bookDescriptionIcon = document.querySelector('.js-book-description-icon');
let search = document.querySelector('.search');
let searchResults = document.querySelector('.search-results');
let searchOverlay = document.querySelector('.search-overlay');

function toggleCart() {
    cart.classList.toggle("hidden");
}

function toggleBookDescription() {
    bookDescription.classList.toggle("hidden");
}

function openBookDescription() {
    toggleBookDescription();
}

function populateBookDescription(e) {
    let element = e.target;

    if (element.tagName != 'A') {
        while (element.tagName != 'A') {
            element = element.parentNode
        }
    }

    // Gather info from main screen
    const bookImg = element.children[0].children[0].src;
    const bookTitle = element.children[1].innerText;
    const bookAuthor = element.children[2].innerText;
    const bookPrice = element.children[1].dataset.price;

    const bookItem = document.querySelector('.book__item');
    bookItem.children[0].src = bookImg;
    bookItem.children[1].children[0].innerText = bookTitle;
    bookItem.children[1].children[1].innerText = bookAuthor;
    bookItem.children[1].children[2].innerText = '$' + bookPrice;

    updateButtonText();
}

function handleAddBook() {
    const bookItem = document.querySelector('.book__item');
    const bookImg = bookItem.children[0].src;
    const bookTitle = bookItem.children[1].children[0].innerText;
    const bookAuthor = bookItem.children[1].children[1].innerText;
    const bookPrice = bookItem.children[1].children[2].innerText.substring(1);

    const cartItems = document.querySelector('.cart__items');
    
    const cartItem = document.createElement('div');
    cartItem.setAttribute('class', 'cart__item');

    const img = document.createElement('img');
    img.src = bookImg;

    const itemContent = document.createElement('div');
    itemContent.setAttribute('class', 'item__content');

    const h3 = document.createElement('h3');
    h3.innerText = bookTitle;

    const pAuthor = document.createElement('p');
    pAuthor.innerText = bookAuthor;
    
    const pPrice = document.createElement('p');
    pPrice.innerText = '$' + bookPrice;
    pPrice.setAttribute('class', 'item__price');

    const remove = document.createElement('i');
    remove.setAttribute('data-feather', 'x');
    remove.setAttribute('onclick', 'handleRemoveBook(this)');

    cartItems.appendChild(cartItem);
    cartItem.appendChild(img);
    cartItem.appendChild(itemContent);
    itemContent.appendChild(h3);
    itemContent.appendChild(pAuthor);
    itemContent.appendChild(pPrice);
    cartItem.appendChild(remove);

    let addBook = document.querySelector('button.action');
    addBook.innerText = 'Book Added';

    feather.replace();
}

function inCart() {
    let cartItems = document.querySelector('.cart__items');
    const bookItem = document.querySelector('.book__item');
    const bookTitle = bookItem.children[1].children[0].innerText;

    cartItems = cartItems.children;
    let inCart = false;

    for (i = 1; i < cartItems.length; i++) {
        if (cartItems[i].children[1].children[0].innerText == bookTitle) {
            inCart = !inCart;
            break;
        } 
    }

    return inCart;
}

function handleBookToggle() {
    let button = document.querySelector('button.action');

    button.innerText == 'Add Book' ? handleAddBook(): handleRemoveBookFromDescription();
    updateCartCount();
    updateCheckout();
}

function updateCheckout() {
    let checkoutSum = 0;
    const button = document.getElementById('checkout');

    try {
        const itemPrice = document.querySelectorAll('.item__price');

        for (i = 0; i < itemPrice.length; i++) {
            checkoutSum += parseFloat(itemPrice[i].innerText.substring(1), 10);
        }

        checkoutSum += (itemPrice.length * 0.07);
    } catch(err) {
        // there's no such element with class of .item__price
    }

    document.getElementById('checkout-price').innerHTML = `<span class="dollar">$</span>${checkoutSum.toFixed(2)}`;
    if (checkoutSum < 1) {
        button.disabled = true;
    } else {
        button.disabled = false;
    }
}

function updateButtonText() {
    let addBook = document.querySelector('button.action');
    if (inCart()) {
        addBook.innerText = 'Book Added';
    } else {
        addBook.innerText = 'Add Book';
    }
}

function updateCartCount() {
    const cartItems = document.querySelector('.cart__items');
    const countDiv = document.querySelector('.js-cart-count');
    const noItems = document.querySelector('.js-no-items');
    let count = cartItems.children.length - 1;

    if (count > 0) {
        countDiv.classList.remove('hidden');
        noItems.classList.add('hidden');
    } else {
        countDiv.classList.add('hidden');
        noItems.classList.remove('hidden');
    }

    countDiv.innerText = count;
}

function handleRemoveBookFromDescription() {
    let cartItems = document.querySelector('.cart__items');
    const bookItem = document.querySelector('.book__item');
    const bookTitle = bookItem.children[1].children[0].innerText;

    cartItems = cartItems.children;

    for (i = 1; i < cartItems.length; i++) {
        if (cartItems[i].children[1].children[0].innerText == bookTitle) {
            cartItems[i].remove();
            break;
        } 
    }

    updateButtonText();
}

function handleRemoveBook(element) {
    element.parentNode.remove();

    updateCartCount();
    updateCheckout();
}

// add event hanlder to each book item on main screen
for (let i = 0; i < bookList.length; i++) {
    bookList[i].addEventListener('click', function(e) {
      e.preventDefault();

      openBookDescription();
      populateBookDescription(e);
    });
}

// this will only execute when the sidebar is open
body.addEventListener('click', () => {
    if (!(cart.classList.contains('hidden'))) { // toggle sidebar ONLY when it does not contain class of 'hidden'
      toggleCart();
    }
});

cartIcon.addEventListener('click', function(e) {
    toggleCart();
    e.stopPropagation();
});

bookDescriptionIcon.addEventListener('click', function() {
    toggleBookDescription();
});

bookDescriptionOverflow.addEventListener('click', function() {
    toggleBookDescription();
});

bookDescriptionWrapper.addEventListener('click', function(e) {
    e.stopPropagation();
});

// this stops the event from bubbling up to the body
cart.addEventListener('click', function(e) {
    e.stopPropagation();
});

search.addEventListener('focus', function() {
    searchResults.classList.remove('hidden');
    searchOverlay.classList.remove('hidden');
    searchWords();
});

search.addEventListener('focusout', function() {
    searchResults.classList.add('hidden');
    searchOverlay.classList.add('hidden');
});

function searchWords() {
    // Declare variables
    var term, ul, li;
    term = search.value.toUpperCase();
    ul = document.querySelector('.search-results');
    li = document.querySelectorAll('.search-item');

    // Loop through all list items, and hide those who don't match the search query
    if (search.value.trim()) {
        for (i = 0; i < li.length; i++) {
            if (li[i].innerHTML.toUpperCase().indexOf(term) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    } else {
        for (i = 0; i < li.length; i++) {
            li[i].style.display = "none";
        }
    }

}