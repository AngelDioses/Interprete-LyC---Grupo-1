document.getElementById('runButton').addEventListener('click', runCode);
document.getElementById('copyButton').addEventListener('click', copyCode);

function runCode() {
    const codeInput = document.getElementById('codeInput').value;
    const outputElement = document.getElementById('output');

    try {
        // Procesar el código de entrada
        const result = interpretCode(codeInput);
        outputElement.textContent = `Resultado: ${result}`;
    } catch (error) {
        outputElement.textContent = `Error: ${error.message}`;
    }
}

function copyCode() {
    const codeInput = document.getElementById('codeInput');
    codeInput.select();
    document.execCommand('copy');
    alert('Código copiado al portapapeles');
}

function interpretCode(code) {
    // Remover líneas vacías y comentarios
    const lines = code.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('//'));
    
    const variables = {};
    let output = '';

    lines.forEach(line => {
        if (line.startsWith('cout<<')) {
            const expr = line.slice(6).replace(';', '').trim();
            output = evaluateExpression(expr, variables);
        } else {
            const [left, right] = line.split('=');
            const varName = left.trim();
            const expr = right.replace(';', '').trim();
            variables[varName] = evaluateExpression(expr, variables);
        }
    });

    return output;
}

function evaluateExpression(expr, variables) {
    // Reemplazar variables por sus valores
    const replacedExpr = expr.replace(/[a-zA-Z_]\w*/g, match => variables[match] !== undefined ? variables[match] : `undefined variable: ${match}`);
    
    // Evaluar la expresión aritmética
    try {
        return new Function(`return ${replacedExpr}`)();
    } catch {
        throw new Error(`Invalid expression: ${expr}`);
    }
}

function loadExample(exampleNumber) {
    const examples = [
        `a = 5;\nb = 3;\nc = 2 + a * b;\ncout<<c;`,
        `a = 5;\nb = 3;\nc = (2 + a) * b;\ncout<<c;`,
        `a = 4;\nb = 6;\na = a + b;\ncout<<a;`,
        `x = 2;\ny = x + 3;\nz = x * y + y;\ncout<<z;`,
        `a = 7;\nb = c + 2;\ncout<<b;`
    ];
    document.getElementById('codeInput').value = examples[exampleNumber - 1];
}
