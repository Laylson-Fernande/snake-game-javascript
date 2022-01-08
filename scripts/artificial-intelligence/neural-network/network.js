class Network {
    layers = [];
    learningRate = 0.01;

    constructor(_layers, _learningRate) {
        for (let i = 0, size = _layers.length - 1; i < size; i++) {
            let layer = new Layer(_layers[i], _layers[i + 1]);
            this.layers.push(layer);
        }
        if (_learningRate) {
            this.learningRate = _learningRate;
        }
    }

    predict(array) {
        let output = Matrix.fromArray(array);
        for (let i = 0; i < this.layers.length; i++) {
            output = this.layers[i].getActivation(output);
        }
        return output.toArray();
    }

    train(x, y) {
        let output = Matrix.fromArray(x);
        for (let i = 0; i < this.layers.length; i++) {
            output = this.layers[i].getActivation(output);
        }

        let target = Matrix.fromArray(y);

        let error = Matrix.subtract(target, output);
        let gradient = output.dsigmoid();
        for (let i = this.layers.length - 1; i >= 0; i--) {
            let layer = this.layers[i];

            gradient.multiplyMatrix(error);
            gradient.multiply(this.learningRate);
            gradient = layer.backPropagation(gradient);
            target = Matrix.transpose(layer.weights);
            error = Matrix.multiply(target, error);
            gradient = layer.hidden.dsigmoid();
        }
    }

    fit(x, y, epochs) {
        for (let i = 0; i < epochs; i++) {
            if ((i % 5000) == 0) {
                console.log(i);
            }
            let rand = Math.floor(Math.random() * x.length);
            this.train(x[rand], y[rand]);
        }
    }

    getGenes() {
        let genes = [];
        for (let i = 0; i < this.layers.length; i++) {
            genes = this.layers[i].getGenes(genes);
        }
        return genes;
    }

    setGenes(genes) {
        for (let i = 0; i < this.layers.length; i++) {
            genes = this.layers[i].setGenes(genes);
        }
    }
}