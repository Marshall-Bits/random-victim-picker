const tagsEl = document.getElementById('tags');
const selectButton = document.getElementById('select-button');
const resetButton = document.getElementById('reset-button');
const modal = document.getElementById('modal');
const modalText = document.getElementById('modal-text');
const spanClose = document.getElementsByClassName('close')[0];
const victimizedList = document.getElementById('victimized-list');
const removeTag = document.getElementsByClassName('remove-tag');

const tags = [
   "Airam",
   "Andrea",
   "Eleni",
   "Èric",
   "Jose",
   "Marta",
   "Roxana",
   "Sven",
   "Tomás",
];


const tagsVictimized = [];

createTags()
 
selectButton.addEventListener('click', (e) => {
    // create a tag for all the inputs separated by a comma
    createTags(e.target.value);

    setTimeout(() => {
        e.target.value = '';
    }, 10)

    randomSelect();
});

resetButton.addEventListener('click', (e) => {
    location.reload();
});

function createTags() {
    // const tags = input.split(',').filter(tag => tag.trim() !== '').map(tag => tag.trim());

    // clean up the tags first
    tagsEl.innerHTML = '';

    // map over the tags and add them to the tagsEl container
    tags.forEach(tag => {
        const removeTag = document.createElement('span');
        const tagEl = document.createElement('span');
        tagEl.classList.add('tag');
        tagEl.innerText = tag;
        tagsEl.appendChild(tagEl);
        // add an X to the tag to remove it
        removeTag.classList.add('remove-tag');
        removeTag.innerText = 'x';
        tagEl.appendChild(removeTag);
        // add event listener to remove the tag
        removeTag.addEventListener('click', (e) => {
            const text = e.target.parentElement.innerText.slice(0, -1);
            e.target.parentElement.remove();
            const index = tags.indexOf(text);
            tags.splice(index, 1);
        });
    })
}

function updateVictimizedList() {
    // clean up the tags first
    victimizedList.innerHTML = '';

    // map over the tags and add them to the tagsEl container
    tagsVictimized.forEach(tag => {
        const tagEl = document.createElement('li');
        tagEl.innerText = tag;
        victimizedList.appendChild(tagEl);
    })
}

function randomSelect() {
    const times = 30;
    let selectedTag;

    const interval = setInterval(() => {
        const randomTag = pickRandomTag();

        highlightTag(randomTag);

        // remove the highlight after a while
        setTimeout(() => {
            unhighlightTag(randomTag);
        }, 100);
    }, 100);

    // allow times * 100 ms for the tags to randomly "highlight" themselves
    // then pick another tag
    setTimeout(() => {
        clearInterval(interval);
        setTimeout(() => {
            selectedTag = pickRandomTag();
            highlightTag(selectedTag)
        }, 100)
    }, times * 100);

    setTimeout(() => {
        modal.style.display = "flex";
        const text = selectedTag.innerText.slice(0, -1);
        modalText.innerHTML = `The next victim is: ${text}!`;
        selectedTag = '';
        // delete the tag from the list in html and from the array
        const tagToDelete = document.querySelector('.highlight');
        tagToDelete.remove();
        const index = tags.indexOf(text);
        tags.splice(index, 1);
        tagsVictimized.push(text);
        updateVictimizedList();
    }, times * 100 + 200);
}

spanClose.onclick = function () {
    modal.style.display = "none";
}

function pickRandomTag() {
    const tags = document.querySelectorAll('.tag');
    return tags[Math.floor(Math.random() * tags.length)];
}

function highlightTag(tag) {
    tag.classList.add('highlight');
}

function unhighlightTag(tag) {
    tag.classList.remove('highlight');
}

const groupButton = document.getElementById('group-button');
const groupList = document.getElementById('group-list');

// Event listener to generate random groups
groupButton.addEventListener('click', generateRandomGroups);

function generateRandomGroups() {
    // Shuffle the tags array and split into 4 groups
    const shuffledTags = shuffleArray([...tags]); // copy the array to avoid mutating original
    const groupCount = 4;
    const groups = Array.from({ length: groupCount }, () => []);

    shuffledTags.forEach((tag, index) => {
        groups[index % groupCount].push(tag);
    });

    displayGroups(groups);
}

// Helper function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Display the generated groups in the DOM
function displayGroups(groups) {
    groupList.innerHTML = ''; // clear the previous groups

    groups.forEach((group, index) => {
        const groupDiv = document.createElement('div');
        groupDiv.classList.add('group');
        const groupTitle = document.createElement('h3');
        groupTitle.innerText = `Group ${index + 1}`;
        groupDiv.appendChild(groupTitle);

        const groupMembers = document.createElement('ul');
        group.forEach(member => {
            const memberItem = document.createElement('li');
            memberItem.innerText = member;
            groupMembers.appendChild(memberItem);
        });
        groupDiv.appendChild(groupMembers);
        groupList.appendChild(groupDiv);
    });
}
