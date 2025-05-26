const yamlInput = document.getElementById('yamlInput');
const jsonOutput = document.getElementById('jsonOutput');
const toggleDark = document.getElementById('toggleDark');

window.addEventListener("load", () => {
	loadYamlFromLocalStorage();
	handleConvertion();
});
// Handle TAB
yamlInput.addEventListener('keydown', (e) => {
	handleTabs(e);
    PR.prettyPrint();
	saveYamlToLocalStorage();

});

// Convert YAML to JSON
yamlInput.addEventListener('input', handleConvertion);
compactCheckbox.addEventListener('change', handleConvertion);

// Toggle dark mode
toggleDark.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

copyOutput.addEventListener('click', () =>{
	navigator.clipboard.writeText(jsonOutput.textContent);
});

function OLD____handleConvertion(){
  try {
    const yamlText = yamlInput.value;
    const jsonObj = jsyaml.load(yamlText);
    jsonOutput.textContent = compactCheckbox.checked? JSON.stringify(jsonObj) : JSON.stringify(jsonObj, null, 2);
  } catch (error) {
    jsonOutput.textContent = `Error: ${error.message}`;
  }
}

function handleConvertion(){
  try {
    const yamlText = yamlInput.value;
    const jsonObj = jsyaml.load(yamlText);
    const jsonStr = compactCheckbox.checked ? JSON.stringify(jsonObj) : JSON.stringify(jsonObj, null, 2);

    // Escape JSON for HTML, to avoid messing up with <, >, etc.
    const escaped = jsonStr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Insert it as HTML so Prettify can work
    jsonOutput.innerHTML = `<code class="prettyprint lang-json">${escaped}</code>`;

    // Pretty print disabled PR.prettyPrint();
  } catch (error) {
    jsonOutput.innerHTML = `<code class="prettyprint lang-json">Error: ${error.message}</code>`;
    PR.prettyPrint();
  }
}


function saveYamlToLocalStorage(){
	localStorage.setItem('yamlInput', yamlInput.value);
};

function loadYamlFromLocalStorage(){
	yamlInput.value = localStorage.getItem('yamlInput');
}


function handleTabs(e) {
	// TODO shift + tab without selection
	indent= '  ';
    if (e.key === 'Tab') {
        e.preventDefault();

        const start = yamlInput.selectionStart;
        const end = yamlInput.selectionEnd;

        const value = yamlInput.value;
        const lines = value.substring(start, end).split('\n');
        const before = value.substring(0, start);
        const after = value.substring(end);
		if (start === end){
			yamlInput.setRangeText(indent, start, end, 'end');
			return
		}

        const isShift = e.shiftKey;

        let selectionOffset = 0;

        if (isShift) {
            // Unindent
            const updatedLines = lines.map(line => {
                if (line.startsWith(indent)) {
                    selectionOffset -= indent.length;
                    return line.slice(indent.length);
                } else if (line.startsWith('\t')) {
                    selectionOffset -= 1;
                    return line.slice(1);
                }
                return line;
            });
            const updatedText = updatedLines.join('\n');
            yamlInput.value = before + updatedText + after;
            yamlInput.selectionStart = start;
            yamlInput.selectionEnd = start + updatedText.length;
        } else {
            // Indent
            const updatedLines = lines.map(line => {
                selectionOffset += indent.length;
                return indent + line;
            });
            const updatedText = updatedLines.join('\n');
            yamlInput.value = before + updatedText + after;
            yamlInput.selectionStart = start;
            yamlInput.selectionEnd = start + updatedText.length;
        }
    }
	handleConvertion();
}
