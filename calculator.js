/**
 * 🤡 TROLL CALCULATOR
 * A calculator that looks perfectly normal...
 * but secretly randomizes the operation performed.
 * 
 * The user presses +, but maybe it does -, ×, or ÷ instead.
 * The display always shows the operation the user THINKS they pressed.
 */

(function () {
    'use strict';

    // ===========================
    // State
    // ===========================
    const state = {
        currentInput: '0',
        previousInput: '',
        displayOperator: null,   // What the user SEES
        actualOperator: null,    // What ACTUALLY happens (troll!)
        waitingForSecondOperand: false,
        result: null,
        justCalculated: false,
        trollCount: 0,           // How many times we've trolled
        lastWasTroll: false,     // Track if last operation was trolled
        history: [],             // Calculation history
        history: [],             // Calculation history
    };

    // Troll messages when the result is wrong
    const trollMessages = [
        "Ούπς... ή μήπως όχι; 🤔",
        "Μαθηματικά à la carte! 🍽️",
        "Σίγουρα αυτό ήθελες; 😏",
        "Trust me, I'm a calculator 🤓",
        "Ε ρε γλέντια... 🎉",
        "Κάτι δεν πάει καλά εδώ... 🫣",
        "Μα τι υπολογισμός ήταν αυτός; 😂",
        "Η μαθηματική ακρίβεια είναι overrated 💅",
        "Λάθος; Ποιο λάθος; 🤷",
        "Ο Πυθαγόρας αυτοκτονεί 💀",
        "Random goes brrr 🤡",
        "Δεν φταίω εγώ, φταίνε τα κουμπιά 👉👈",
    ];

    // Emoji sets for floating reactions
    const trollEmojis = ['🤡', '😈', '💀', '🎪', '🃏', '😂', '🤣', '🫠', '🤪'];

    // Operation symbols for display
    const opSymbols = {
        add: '+',
        subtract: '−',
        multiply: '×',
        divide: '÷',
    };

    // ===========================
    // DOM Elements
    // ===========================
    const $ = (id) => document.getElementById(id);

    const displayEl = $('display');
    const expressionEl = $('expression');
    const trollToast = $('trollToast');
    const trollMessageEl = $('trollMessage');
    const trollOverlay = $('trollOverlay');

    // ===========================
    // Troll Logic 🤡
    // ===========================

    /**
     * The core troll function.
     * Given the operator the user INTENDED, returns
     * a potentially DIFFERENT operator.
     * 
     * 100% chance to troll (ALWAYS swaps to a random different op)
     * There is no escape. 🤡
     */
    function trollOperator(intendedOp) {
        const ops = ['add', 'subtract', 'multiply', 'divide'];
        const trollChance = 1.0; // 100% chance to troll

        if (Math.random() < trollChance) {
            // Pick a DIFFERENT operation
            const otherOps = ops.filter(op => op !== intendedOp);
            const trollOp = otherOps[Math.floor(Math.random() * otherOps.length)];
            state.lastWasTroll = true;
            return trollOp;
        }

        state.lastWasTroll = false;
        return intendedOp;
    }

    /**
     * Perform the actual calculation
     */
    function calculate(a, b, operator) {
        const numA = parseFloat(a);
        const numB = parseFloat(b);

        switch (operator) {
            case 'add':      return numA + numB;
            case 'subtract': return numA - numB;
            case 'multiply': return numA * numB;
            case 'divide':
                if (numB === 0) return 'Cannot divide by zero';
                return numA / numB;
            default: return numB;
        }
    }

    /**
     * Format a number for display
     */
    function formatDisplay(value) {
        if (typeof value === 'string') return value;

        // Handle special cases
        if (!isFinite(value)) return 'Overflow';
        if (isNaN(value)) return 'NaN 🤡';

        // Format with reasonable precision
        let formatted;
        if (Number.isInteger(value) && Math.abs(value) < 1e15) {
            formatted = value.toLocaleString('en-US', { maximumFractionDigits: 0 });
        } else {
            // Round to avoid floating point weirdness
            const rounded = parseFloat(value.toPrecision(12));
            if (Math.abs(rounded) >= 1e15) {
                formatted = rounded.toExponential(4);
            } else {
                formatted = rounded.toLocaleString('en-US', { maximumFractionDigits: 10 });
            }
        }

        return formatted;
    }

    /**
     * Update display size based on content length
     */
    function updateDisplaySize() {
        displayEl.classList.remove('shrink-1', 'shrink-2', 'shrink-3');
        const len = displayEl.textContent.length;
        if (len > 16) displayEl.classList.add('shrink-3');
        else if (len > 12) displayEl.classList.add('shrink-2');
        else if (len > 9) displayEl.classList.add('shrink-1');
    }

    /**
     * Update the display
     */
    function updateDisplay() {
        displayEl.textContent = formatDisplay(
            state.justCalculated ? state.result : parseFloat(state.currentInput)
        );
        updateDisplaySize();
    }

    /**
     * Update the expression line
     */
    function updateExpression() {
        if (state.previousInput && state.displayOperator) {
            const symbol = opSymbols[state.displayOperator];
            expressionEl.textContent = `${formatDisplay(parseFloat(state.previousInput))} ${symbol}`;
        } else {
            expressionEl.innerHTML = '&nbsp;';
        }
    }

    // ===========================
    // Troll Visual Effects
    // ===========================

    function showTrollToast() {
        const msg = trollMessages[Math.floor(Math.random() * trollMessages.length)];
        trollMessageEl.textContent = msg;
        trollToast.classList.add('visible');

        setTimeout(() => {
            trollToast.classList.remove('visible');
        }, 2500);
    }

    function spawnFloatingEmojis() {
        const count = 5 + Math.floor(Math.random() * 5);
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const emoji = document.createElement('span');
                emoji.className = 'floating-emoji';
                emoji.textContent = trollEmojis[Math.floor(Math.random() * trollEmojis.length)];
                emoji.style.left = `${Math.random() * 100}%`;
                emoji.style.top = `${60 + Math.random() * 30}%`;
                emoji.style.fontSize = `${20 + Math.random() * 30}px`;
                emoji.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
                trollOverlay.appendChild(emoji);

                emoji.addEventListener('animationend', () => emoji.remove());
            }, i * 100);
        }
    }

    function shakeDisplay() {
        displayEl.classList.add('shake');
        setTimeout(() => displayEl.classList.remove('shake'), 500);
    }

    function flashDisplay() {
        displayEl.classList.add('troll-flash');
        setTimeout(() => displayEl.classList.remove('troll-flash'), 300);
    }

    function playTrollEffects() {
        state.trollCount++;
        showTrollToast();
        spawnFloatingEmojis();
        shakeDisplay();
        flashDisplay();
    }

    // ===========================
    // Calculator Operations
    // ===========================

    function inputDigit(digit) {
        if (state.justCalculated) {
            state.currentInput = digit;
            state.justCalculated = false;
        } else if (state.waitingForSecondOperand) {
            state.currentInput = digit;
            state.waitingForSecondOperand = false;
        } else {
            // Max 16 digits
            const cleanInput = state.currentInput.replace(/[^0-9.]/g, '');
            if (cleanInput.length >= 16) return;
            state.currentInput = state.currentInput === '0' ? digit : state.currentInput + digit;
        }
        updateDisplay();
    }

    function inputDecimal() {
        if (state.justCalculated) {
            state.currentInput = '0.';
            state.justCalculated = false;
            updateDisplay();
            displayEl.textContent = '0.';
            return;
        }
        if (state.waitingForSecondOperand) {
            state.currentInput = '0.';
            state.waitingForSecondOperand = false;
            updateDisplay();
            displayEl.textContent = '0.';
            return;
        }
        if (!state.currentInput.includes('.')) {
            state.currentInput += '.';
            // Show the dot immediately
            displayEl.textContent = formatDisplay(parseFloat(state.currentInput));
            if (state.currentInput.endsWith('.')) {
                displayEl.textContent += '.';
            }
            updateDisplaySize();
        }
    }

    function setOperator(op) {
        const inputValue = parseFloat(state.currentInput);

        // Clear active operator highlight
        clearActiveOp();

        if (state.previousInput && state.waitingForSecondOperand) {
            // Just change the operator
            state.displayOperator = op;
            state.actualOperator = trollOperator(op);
            updateExpression();
            highlightActiveOp(op);
            return;
        }

        if (state.previousInput && !state.waitingForSecondOperand) {
            // Chain operations
            const result = calculate(state.previousInput, state.currentInput, state.actualOperator);

            if (typeof result === 'string') {
                displayEl.textContent = result;
                resetState();
                return;
            }

            if (state.lastWasTroll) {
                playTrollEffects();
            }

            state.result = result;
            state.currentInput = String(result);
            displayEl.textContent = formatDisplay(result);
            updateDisplaySize();
        }

        state.previousInput = state.currentInput;
        state.displayOperator = op;
        state.actualOperator = trollOperator(op);
        state.waitingForSecondOperand = true;
        state.justCalculated = false;
        updateExpression();
        highlightActiveOp(op);
    }

    function performEquals() {
        if (!state.previousInput || !state.displayOperator) return;

        const result = calculate(state.previousInput, state.currentInput, state.actualOperator);

        if (typeof result === 'string') {
            displayEl.textContent = result;
            resetState();
            return;
        }

        // Save for history before clearing state
        const prevA = state.previousInput;
        const prevB = state.currentInput;
        const displaySymbol = opSymbols[state.displayOperator];
        const wasTroll = state.lastWasTroll;

        // Show full expression in the expression line
        expressionEl.textContent = `${formatDisplay(parseFloat(prevA))} ${displaySymbol} ${formatDisplay(parseFloat(prevB))} =`;

        // Show troll effects if we trolled
        if (wasTroll) {
            setTimeout(() => { playTrollEffects(); }, 200);
        }

        state.result = result;
        state.currentInput = String(result);
        state.previousInput = '';
        state.displayOperator = null;
        state.actualOperator = null;
        state.waitingForSecondOperand = false;
        state.justCalculated = true;

        displayEl.textContent = formatDisplay(result);
        updateDisplaySize();
        clearActiveOp();

        // Save to history
        addToHistory(
            `${formatDisplay(parseFloat(prevA))} ${displaySymbol} ${formatDisplay(parseFloat(prevB))}`,
            formatDisplay(result),
            wasTroll
        );
    }

    function clearAll() {
        resetState();
        updateDisplay();
        updateExpression();
        clearActiveOp();
    }

    function clearEntry() {
        state.currentInput = '0';
        state.justCalculated = false;
        updateDisplay();
    }

    function backspace() {
        if (state.justCalculated) return;
        if (state.currentInput.length <= 1 || (state.currentInput.length === 2 && state.currentInput[0] === '-')) {
            state.currentInput = '0';
        } else {
            state.currentInput = state.currentInput.slice(0, -1);
        }
        updateDisplay();
    }

    // ===========================
    // Troll Unary Operation
    // ===========================

    // All 5 unary ops as plain functions (no troll inside)
    const unaryOps = {
        negate: (v) => -v,
        percent: (v) => state.previousInput ? (parseFloat(state.previousInput) * v) / 100 : v / 100,
        reciprocal: (v) => v === 0 ? null : 1 / v,
        square: (v) => v * v,
        squareRoot: (v) => v < 0 ? null : Math.sqrt(v),
    };

    const unaryNames = {
        negate:      '⁺/₋',
        percent:     '%',
        reciprocal:  '1/x',
        square:      'x²',
        squareRoot:  '²√x',
    };

    function trollUnary(intendedOp) {
        const ops = Object.keys(unaryOps);
        const others = ops.filter(op => op !== intendedOp);
        return others[Math.floor(Math.random() * others.length)];
    }

    function applyUnary(intendedOp) {
        const actualOp = trollUnary(intendedOp);
        const value = parseFloat(state.currentInput);
        const result = unaryOps[actualOp](value);

        if (result === null) {
            displayEl.textContent = actualOp === 'reciprocal' ? 'Cannot divide by zero' : 'Invalid input';
            resetState();
            return;
        }

        state.currentInput = String(result);
        if (state.justCalculated) state.result = result;
        updateDisplay();

        // Always troll → always show effects
        state.lastWasTroll = true;
        setTimeout(() => { playTrollEffects(); }, 150);
    }

    function negate()      { applyUnary('negate');      }
    function percent()     { applyUnary('percent');     }
    function reciprocal()  { applyUnary('reciprocal');  }
    function square()      { applyUnary('square');      }
    function squareRoot()  { applyUnary('squareRoot');  }


    // ===========================
    // UI Helpers
    // ===========================

    function resetState() {
        state.currentInput = '0';
        state.previousInput = '';
        state.displayOperator = null;
        state.actualOperator = null;
        state.waitingForSecondOperand = false;
        state.result = null;
        state.justCalculated = false;
        state.lastWasTroll = false;
    }

    function highlightActiveOp(op) {
        const opBtnMap = {
            add: 'addBtn',
            subtract: 'subtractBtn',
            multiply: 'multiplyBtn',
            divide: 'divideBtn',
        };
        const btn = $(opBtnMap[op]);
        if (btn) btn.classList.add('active-op');
    }

    function clearActiveOp() {
        document.querySelectorAll('.active-op').forEach(b => b.classList.remove('active-op'));
    }

    // Ripple effect on buttons
    function createRipple(event, button) {
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        const rect = button.getBoundingClientRect();
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.className = 'ripple';

        // Remove old ripple
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) existingRipple.remove();

        button.appendChild(circle);
    }

    // ===========================
    // Event Listeners
    // ===========================

    // Number buttons
    for (let i = 0; i <= 9; i++) {
        $(`btn${i}`).addEventListener('click', (e) => {
            createRipple(e, e.currentTarget);
            inputDigit(String(i));
        });
    }

    // Decimal
    $('decimalBtn').addEventListener('click', (e) => {
        createRipple(e, e.currentTarget);
        inputDecimal();
    });

    // Operators
    $('addBtn').addEventListener('click', (e) => {
        createRipple(e, e.currentTarget);
        setOperator('add');
    });
    $('subtractBtn').addEventListener('click', (e) => {
        createRipple(e, e.currentTarget);
        setOperator('subtract');
    });
    $('multiplyBtn').addEventListener('click', (e) => {
        createRipple(e, e.currentTarget);
        setOperator('multiply');
    });
    $('divideBtn').addEventListener('click', (e) => {
        createRipple(e, e.currentTarget);
        setOperator('divide');
    });

    // Equals
    $('equalsBtn').addEventListener('click', (e) => {
        createRipple(e, e.currentTarget);
        performEquals();
    });

    // Clear / CE / Backspace
    $('clearBtn').addEventListener('click', (e) => {
        createRipple(e, e.currentTarget);
        clearAll();
    });
    $('ceBtn').addEventListener('click', (e) => {
        createRipple(e, e.currentTarget);
        clearEntry();
    });
    $('backspaceBtn').addEventListener('click', (e) => {
        createRipple(e, e.currentTarget);
        backspace();
    });

    // Special functions
    $('negateBtn').addEventListener('click', (e) => {
        createRipple(e, e.currentTarget);
        negate();
    });
    $('percentBtn').addEventListener('click', (e) => {
        createRipple(e, e.currentTarget);
        percent();
    });
    $('reciprocalBtn').addEventListener('click', (e) => {
        createRipple(e, e.currentTarget);
        reciprocal();
    });
    $('squareBtn').addEventListener('click', (e) => {
        createRipple(e, e.currentTarget);
        square();
    });
    $('sqrtBtn').addEventListener('click', (e) => {
        createRipple(e, e.currentTarget);
        squareRoot();
    });


    // ===========================
    // Menu Button — "Μόνο το Standard"
    // ===========================
    (function setupMenuPopup() {
        const menuBtn = $('menuBtn');

        const popup = document.createElement('div');
        popup.id = 'menuPopup';
        popup.style.cssText = `
            position: absolute;
            top: 72px;
            left: 8px;
            background: #2d2d2d;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 12px 20px;
            font-size: 14px;
            color: #a0a0a0;
            white-space: nowrap;
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
            z-index: 50;
            opacity: 0;
            transform: translateY(-6px) scale(0.97);
            transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.16,1,0.3,1);
            pointer-events: none;
        `;
        popup.textContent = '📋 Μόνο το Standard για τώρα';
        $('calculator').appendChild(popup);

        let hideTimer = null;

        function showPopup() {
            clearTimeout(hideTimer);
            popup.style.pointerEvents = 'auto';
            popup.style.opacity = '1';
            popup.style.transform = 'translateY(0) scale(1)';
            hideTimer = setTimeout(hidePopup, 2000);
        }

        function hidePopup() {
            popup.style.opacity = '0';
            popup.style.transform = 'translateY(-6px) scale(0.97)';
            popup.style.pointerEvents = 'none';
        }

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = popup.style.opacity === '1';
            isVisible ? hidePopup() : showPopup();
        });

        document.addEventListener('click', hidePopup);
    })();

    // ===========================
    // Title bar buttons — teleport calculator
    // ===========================
    function teleportCalculator() {
        const calc = $('calculator');
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const cw = calc.offsetWidth;
        const ch = calc.offsetHeight;

        const maxX = vw - cw - 10;
        const maxY = vh - ch - 10;
        const randX = Math.max(10, Math.floor(Math.random() * maxX));
        const randY = Math.max(10, Math.floor(Math.random() * maxY));

        if (calc.style.position !== 'fixed') {
            calc.style.position = 'fixed';
            document.body.style.alignItems = 'flex-start';
            document.body.style.justifyContent = 'flex-start';
        }
        calc.style.transition = 'left 0.45s cubic-bezier(0.16,1,0.3,1), top 0.45s cubic-bezier(0.16,1,0.3,1)';
        calc.style.left = randX + 'px';
        calc.style.top = randY + 'px';
    }

    ['closeBtn', 'minimizeBtn', 'maximizeBtn'].forEach(id => {
        $(id).addEventListener('click', teleportCalculator);
    });


    // ===========================
    // History Panel
    // ===========================
    (function setupHistory() {
        const historyBtn = $('historyBtn');
        const calc = $('calculator');
        let historyOpen = false;

        // Build panel HTML
        const panel = document.createElement('div');
        panel.id = 'historyPanel';
        panel.innerHTML = `
            <div class="history-header">
                <span class="history-title" id="historyTitleBtn" style="cursor:pointer;" title="Κλείσιμο ιστορικού">Ιστορικό</span>
                <button class="history-clear-btn" id="historyClearBtn" title="Διαγραφή ιστορικού">🗑</button>
            </div>
            <div class="history-list" id="historyList">
                <div class="history-empty" id="historyEmpty">
                    <span>Δεν υπάρχει ιστορικό</span>
                </div>
            </div>
        `;
        calc.appendChild(panel);

        // Inject styles
        const style = document.createElement('style');
        style.textContent = `
            #historyPanel {
                position: absolute;
                top: 32px; /* below title bar */
                left: 0; right: 0; bottom: 0;
                background: #252525;
                border-radius: 0 0 12px 12px;
                display: flex;
                flex-direction: column;
                transform: translateX(100%);
                transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
                z-index: 20;
                overflow: hidden;
            }
            #historyPanel.open {
                transform: translateX(0);
            }
            .history-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 16px 10px;
                border-bottom: 1px solid rgba(255,255,255,0.06);
                flex-shrink: 0;
            }
            .history-title {
                font-size: 20px;
                font-weight: 600;
                color: #fff;
            }
            .history-clear-btn {
                background: transparent;
                border: none;
                font-size: 18px;
                cursor: pointer;
                padding: 6px;
                border-radius: 6px;
                transition: background 0.15s;
                line-height: 1;
            }
            .history-clear-btn:hover { background: rgba(255,255,255,0.08); }
            .history-list {
                flex: 1;
                overflow-y: auto;
                padding: 8px 0;
                display: flex;
                flex-direction: column-reverse; /* newest at top */
            }
            .history-list::-webkit-scrollbar { width: 4px; }
            .history-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
            .history-empty {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: #555;
                font-size: 14px;
                padding: 20px;
            }
            .history-entry {
                padding: 10px 16px;
                border-radius: 6px;
                margin: 2px 8px;
                cursor: pointer;
                transition: background 0.12s;
                text-align: right;
            }
            .history-entry:hover { background: rgba(255,255,255,0.06); }
            .history-entry .h-expr {
                font-size: 13px;
                color: #888;
                margin-bottom: 2px;
            }
            .history-entry .h-result {
                font-size: 24px;
                font-weight: 300;
                color: #fff;
            }
            .history-entry.troll-entry .h-expr::after {
                content: ' 🤡';
            }
        `;
        document.head.appendChild(style);

        // ── Fake history generator ──────────────────────────────
        function randInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function randNum() {
            // Mix of integers, decimals, negatives
            const type = Math.random();
            if (type < 0.55) return randInt(1, 999);
            if (type < 0.75) return randInt(1, 9999);
            if (type < 0.88) return parseFloat((Math.random() * 100).toFixed(2));
            return -randInt(1, 99);
        }

        function fmtNum(n) {
            if (Number.isInteger(n)) return n.toLocaleString('en-US');
            return parseFloat(n.toPrecision(8)).toLocaleString('en-US', { maximumFractionDigits: 6 });
        }

        const binaryOps = [
            { sym: '+',  fn: (a,b) => a + b },
            { sym: '−',  fn: (a,b) => a - b },
            { sym: '×',  fn: (a,b) => a * b },
            { sym: '÷',  fn: (a,b) => b !== 0 ? a / b : null },
        ];

        const unaryFakes = [
            { label: (n) => `sqr(${fmtNum(n)})`,  fn: (n) => n * n },
            { label: (n) => `√(${fmtNum(n)})`,    fn: (n) => n >= 0 ? Math.sqrt(n) : null },
            { label: (n) => `1/(${fmtNum(n)})`,   fn: (n) => n !== 0 ? 1/n : null },
            { label: (n) => `${fmtNum(n)}%`,       fn: (n) => n / 100 },
        ];

        function generateFakeEntry() {
            // 70% binary, 30% unary
            if (Math.random() < 0.70) {
                const a = randNum();
                const b = randNum();
                const op = binaryOps[randInt(0, binaryOps.length - 1)];
                const result = op.fn(a, b);
                if (result === null || !isFinite(result)) return null;
                const rFmt = fmtNum(parseFloat(result.toPrecision(10)));
                return {
                    expression: `${fmtNum(a)} ${op.sym} ${fmtNum(b)}`,
                    result: rFmt,
                    rawResult: String(result),
                    wasTroll: true,   // all fake → always 🤡
                    fake: true,
                };
            } else {
                const n = Math.abs(randNum()) + 1;
                const u = unaryFakes[randInt(0, unaryFakes.length - 1)];
                const result = u.fn(n);
                if (result === null || !isFinite(result)) return null;
                const rFmt = fmtNum(parseFloat(result.toPrecision(10)));
                return {
                    expression: u.label(n),
                    result: rFmt,
                    rawResult: String(result),
                    wasTroll: true,
                    fake: true,
                };
            }
        }

        function generateFakeHistory() {
            const count = randInt(5, 12);
            const fakes = [];
            let attempts = 0;
            while (fakes.length < count && attempts < 40) {
                const entry = generateFakeEntry();
                if (entry) fakes.push(entry);
                attempts++;
            }
            return fakes;
        }
        // ─────────────────────────────────────────────────────

        // Toggle panel — generate fresh fake history on every open
        historyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            historyOpen = !historyOpen;
            if (historyOpen) {
                // Replace fake entries, keep real ones at the top
                const realEntries = state.history.filter(e => !e.fake);
                state.history = [...generateFakeHistory(), ...realEntries];
                renderHistory();
            }
            panel.classList.toggle('open', historyOpen);
            historyBtn.style.color = historyOpen ? 'var(--btn-equals-bg)' : '';
        });

        // Click title to close history
        document.getElementById('historyTitleBtn').addEventListener('click', () => {
            historyOpen = false;
            panel.classList.remove('open');
            historyBtn.style.color = '';
        });

        // Clear history (wipes everything, then re-generates fakes on next open)
        document.getElementById('historyClearBtn').addEventListener('click', () => {
            state.history = [];
            renderHistory();
        });

        function renderHistory() {
            const list = $('historyList');
            if (state.history.length === 0) {
                list.innerHTML = '<div class="history-empty"><span>Δεν υπάρχει ιστορικό</span></div>';
                return;
            }
            list.innerHTML = '';
            state.history.forEach((entry, idx) => {
                const div = document.createElement('div');
                div.className = 'history-entry' + (entry.wasTroll ? ' troll-entry' : '');
                div.innerHTML = `<div class="h-expr">${entry.expression} =</div><div class="h-result">${entry.result}</div>`;
                div.addEventListener('click', () => {
                    state.currentInput = entry.rawResult;
                    state.justCalculated = true;
                    state.waitingForSecondOperand = false;
                    updateDisplay();
                    // Close panel
                    historyOpen = false;
                    panel.classList.remove('open');
                    historyBtn.style.color = '';
                });
                list.appendChild(div);
            });
        }

        // Expose addToHistory globally within the IIFE scope
        window._calcAddToHistory = function(expression, result, rawResult, wasTroll) {
            state.history.push({ expression, result, rawResult, wasTroll });
            if (historyOpen) renderHistory();
        };
    })();

    function addToHistory(expression, result, wasTroll) {
        const rawResult = String(state.result);
        if (window._calcAddToHistory) {
            window._calcAddToHistory(expression, result, rawResult, wasTroll);
        }
    }

    // ===========================
    // Keyboard Support
    // ===========================
    document.addEventListener('keydown', (e) => {
        // Prevent default for calculator keys
        if (/^[0-9.+\-*/=%]$/.test(e.key) || ['Enter', 'Backspace', 'Delete', 'Escape'].includes(e.key)) {
            e.preventDefault();
        }

        // Numbers
        if (/^[0-9]$/.test(e.key)) {
            inputDigit(e.key);
            return;
        }

        switch (e.key) {
            case '.':
            case ',':
                inputDecimal();
                break;
            case '+':
                setOperator('add');
                break;
            case '-':
                setOperator('subtract');
                break;
            case '*':
                setOperator('multiply');
                break;
            case '/':
                setOperator('divide');
                break;
            case '=':
            case 'Enter':
                performEquals();
                break;
            case 'Backspace':
                backspace();
                break;
            case 'Delete':
                clearEntry();
                break;
            case 'Escape':
                clearAll();
                break;
            case '%':
                percent();
                break;
        }
    });

    // ===========================
    // Init
    // ===========================
    updateDisplay();

    // Console easter egg
    console.log(
        '%c🤡 TROLL CALCULATOR 🤡',
        'font-size: 24px; color: #4cc2ff; font-weight: bold;'
    );
    console.log(
        '%cThis calculator has a 100% chance of using the WRONG operation. Every. Single. Time.',
        'font-size: 14px; color: #ff6b6b;'
    );
    console.log(
        '%cYou pressed +? It did something else. Always. No exceptions. Goodbye. 😈',
        'font-size: 12px; color: #a0a0a0;'
    );
})();