class Layer {
    weights;
    bias;
    hidden;

    constructor(input, neurons) {
        this.weights = new Matrix(neurons, input);
        this.bias = new Matrix(neurons, 1);
        this.hidden = null;
    }

    getActivation(input) {
        this.hidden = input;
        let output = Matrix.multiply(this.weights, input);
        output.addMatrix(this.bias);
        output.sigmoid();
        return output;
    }

    backPropagation(gradient) {
        let transpose = Matrix.transpose(this.hidden);
        let delta = Matrix.multiply(gradient, transpose);
        this.weights.addMatrix(delta);
        this.bias.addMatrix(gradient);
        return this.weights;
    }

    getGenes(genes) {
        let tempArray = this.weights.toArray();
        Array.prototype.push.apply(genes, tempArray);

        tempArray = this.bias.toArray();
        Array.prototype.push.apply(genes, tempArray);
        return genes;
    }

    setGenes(genes) {
        let genesIndex = 0;
        let size = this.weights.rows * this.weights.cols;
        let tempArray = genes.slice(genesIndex, size);
        this.weights.dataFromArray(tempArray);

        genesIndex = size;
        size = size + this.bias.rows * this.bias.cols;
        tempArray = genes.slice(genesIndex, size);
        this.bias.dataFromArray(tempArray);
        return genes.slice(size);
    }

    get weights() {
        return this.weights;
    }

    set weights(_weights) {
        this.weights = _weights;
    }

    get bias() {
        return this.bias;
    }

    set bias(_bias) {
        this.bias = _bias;
    }

    get hidden() {
        return this.hidden;
    }

    set hidden(_hidden) {
        this.hidden = _hidden;
    }
}