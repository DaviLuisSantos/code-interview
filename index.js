document.addEventListener('DOMContentLoaded', () => {
    // Get references to the necessary DOM elements
    const commandInput = document.getElementById('commandInput');
    const options = document.getElementById('options');
    const optionTitle = options.querySelector('.option-title');
    const optionDescription = options.querySelector('.option-description');
    const keywordSpan = options.querySelector('.keyword');
    const contentDiv = document.querySelector('.texto');

    // Function to create and insert option elements dynamically
    function createOptions() {
        const option1 = document.createElement('div');
        option1.className = 'option bold';
        option1.setAttribute('data-value', 'h1');
        option1.innerHTML = `
            <i class="fa-solid fa-text-width"></i>
            <div>
                <span class="option-text">Heading 1</span>
                <small>Shortcut: type # + space</small>
            </div>
        `;
        options.appendChild(option1);

        const option2 = document.createElement('div');
        option2.className = 'option bold';
        option2.setAttribute('data-value', 'expandable-h1');
        option2.innerHTML = `
            <div class="T-icon">
                <i class="fa-solid fa-text-width"></i>
            </div>
            <div>
                <span class="option-text">Expandable Heading 1</span>
                <small>Shortcut: type >># + space</small>
            </div>
        `;
        options.appendChild(option2);

        const option3 = document.createElement('div');
        option3.className = 'option';
        option3.setAttribute('data-value', 'normal-text');
        option3.innerHTML = `
            <div class="T-icon">
                <i class="fa-solid fa-paragraph"></i>
            </div>
            <div>
                <span class="option-text">Normal Text</span>
                <small>Shortcut: type /+1</small>
            </div>
        `;
        options.appendChild(option3);
    }

    // Call the function to create and insert options
    createOptions();

    // Function to update the visibility and content of the options
    function updateOptionsVisibility() {
        const inputText = commandInput.value.trim();
        const [command, keyword] = inputText.split(' ').filter(Boolean);

        if (command && command.startsWith('/')) {
            const commandText = command.substring(1); // Remove '/'

            // Update the content of the keyword span
            keywordSpan.textContent = commandText;

            // Show the options
            options.style.display = 'flex';
            optionTitle.textContent = 'Add blocks';
            optionDescription.textContent = 'Keep typing to filter, or escape to exit';

            // Show or hide specific options based on the command
            document.querySelectorAll('.option').forEach(option => {
                if (command === '/1') {
                    if (option.getAttribute('data-value') === 'h1' || option.getAttribute('data-value') === 'expandable-h1') {
                        option.style.display = 'flex';
                    } else {
                        option.style.display = 'none';
                    }
                } else if (command === '/+1') {
                    if (option.getAttribute('data-value') === 'normal-text') {
                        option.style.display = 'flex';
                    } else {
                        option.style.display = 'none';
                    }
                } else {
                    option.style.display = 'none';
                }
            });
        } else {
            // Hide options if command is not recognized
            options.style.display = 'none';
        }
    }

    // Add event listener for input changes
    commandInput.addEventListener('input', updateOptionsVisibility);

    // Add global event listener for shortcut (#+space)
    let keysPressed = {};
    // Add global event listener for shortcut (#+space)
    document.addEventListener('keydown', (e) => {
        keysPressed[e.key] = true;
        if (keysPressed['Shift'] && keysPressed['#'] && e.key === ' ') {
            e.preventDefault();
            activeHeading();
        }
    });

    function activeHeading() {
        // Update the input placeholder
        commandInput.placeholder = 'Heading 1';
        commandInput.classList.add('placeholder-heading-1');
        // Clear the input value
        commandInput.value = '';
        commandInput.focus(); // Refocus input field

        // Hide options
        options.style.display = 'none';

        // Add event listener for 'Enter' key to convert text to <h1>
        commandInput.addEventListener('keydown', function onEnter(e) {
            if (e.key === 'Enter') {
                const textToInsert = commandInput.value.trim();

                if (textToInsert) {
                    const h1 = document.createElement('h1');
                    h1.textContent = textToInsert;
                    h1.classList.add('heading-created');
                    contentDiv.appendChild(h1); // Add new h1 to existing content

                    // Clear input value
                    commandInput.value = '';
                    commandInput.placeholder = 'Type / for blocks, @ to link docs or people'; // Reset placeholder
                    commandInput.classList.remove('placeholder-heading-1');

                    // Remove event listener after processing
                    commandInput.removeEventListener('keydown', onEnter);

                    // Add event listener for creating paragraph after heading
                    prepareForParagraph();
                }
            }
        });
    }

    document.addEventListener('keyup', (e) => {
        delete keysPressed[e.key];
    });

    // Add event listeners to each option
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function () {
            const selectedValue = this.getAttribute('data-value');

            if (selectedValue === 'h1') {
                activeHeading();
            }

            if (selectedValue === 'normal-text') {
                // Update the input placeholder
                commandInput.placeholder = 'Normal Text';
                commandInput.classList.add('placeholder-normal-text');
                // Clear the input value
                commandInput.value = '';
                commandInput.focus(); // Refocus input field

                // Hide options
                options.style.display = 'none';

                // Add event listener for 'Enter' key to convert text to <p>
                commandInput.addEventListener('keydown', function onEnter(e) {
                    if (e.key === 'Enter') {
                        const textToInsert = commandInput.value.trim();

                        if (textToInsert) {
                            const p = document.createElement('p');
                            p.textContent = textToInsert;
                            contentDiv.appendChild(p); // Add new paragraph to existing content

                            // Clear input value
                            commandInput.value = '';
                            commandInput.placeholder = 'Type / for blocks, @ to link docs or people'; // Reset placeholder
                            commandInput.classList.remove('placeholder-normal-text');

                            // Remove event listener after processing
                            commandInput.removeEventListener('keydown', onEnter);
                        }
                    }
                });
            }
        });
    });

    // Function to prepare for adding a paragraph after a heading
    function prepareForParagraph() {
        commandInput.addEventListener('keydown', function onEnterForParagraph(e) {
            const inputText = commandInput.value.trim();
            if (inputText === '/+1') {
                commandInput.placeholder = 'Normal text';
                commandInput.classList.add('placeholder-normal-text');
                commandInput.value = '';
                e.preventDefault();

                commandInput.addEventListener('keydown', function onEnterParagraph(e) {
                    if (e.key === 'Enter') {
                        const textToInsert = commandInput.value.trim();

                        if (textToInsert) {
                            const p = document.createElement('p');
                            p.textContent = textToInsert;
                            contentDiv.appendChild(p); // Add new paragraph to existing content

                            // Clear input value
                            commandInput.value = '';
                            commandInput.placeholder = 'Type / for blocks, @ to link docs or people'; // Reset placeholder
                            commandInput.classList.remove('placeholder-normal-text');

                            // Remove event listener after processing
                            commandInput.removeEventListener('keydown', onEnterParagraph);
                        }
                    }
                });
            }
        });
    }

    // Hide options if clicking outside the input and options area
    document.addEventListener('click', function (e) {
        if (!options.contains(e.target) && e.target.id !== 'commandInput') {
            options.style.display = 'none';
        }
    });

    // Hide options if 'Escape' key is pressed
    commandInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            options.style.display = 'none';
        }
    });

    // Initialize visibility based on current input
    updateOptionsVisibility();
});
