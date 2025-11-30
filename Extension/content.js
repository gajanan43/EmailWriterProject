console.log("Email Writer Extension content script loaded.");

function createAIButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button';
    button.style.marginRight = '8px';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    return button;
}

/* ---------- FIXED LOOP ---------- */
function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];

    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
    }
    return '';
}

/* ---------- FIXED LOOP ---------- */
function findComposeToolbar() {
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];

    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) return toolbar;
    }
    return null;
}

/* ---------- FIXED COMPOSE BOX SELECTORS ---------- */
function findComposeBox() {
    return (
        document.querySelector('[aria-label="Message Body"]') ||
        document.querySelector('div[role="textbox"][g_editable="true"]') ||
        document.querySelector('div[contenteditable="true"]')
    );
}


function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) existingButton.remove();

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("Toolbar not found");
        return;
    }

    console.log("Toolbar found, creating AI button.");
    const button = createAIButton();

    button.addEventListener('click', async () => {
        try {
            button.innerText = "Generating...";
            button.style.opacity = 0.6;

            const emailContent = getEmailContent();
            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: "professional"
                })
            });

            if (!response.ok) throw new Error("API Error " + response.status);

            const generatedText = await response.text();
            const composeBox = findComposeBox();

            if (!composeBox) {
                console.error("Compose box not found.");
                return;
            }

            composeBox.focus();
            document.execCommand('insertText', false, generatedText);
        } catch (error) {
            console.error("Error generating reply:", error);
        } finally {
            button.innerHTML = 'AI Reply';
            button.style.opacity = 1;
        }
    });

    toolbar.insertBefore(button, toolbar.firstChild);
    console.log("AI button injected.");
}

/* ---------- FIXED observer spelling ---------- */
const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
        const addedNodes = [...mutation.addedNodes];

        const hasCompose = addedNodes.some(node =>
            node.nodeType === 1 &&
            (
                node.matches?.('.aDh, .btC, [role="dialog"]') ||
                node.querySelector?.('.aDh, .btC, [role="dialog"]')
            )
        );

        if (hasCompose) {
            console.log("Compose window detected");
            setTimeout(injectButton, 500);
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });
