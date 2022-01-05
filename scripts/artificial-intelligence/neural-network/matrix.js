class Matrix {
    data = [[]];
    rows = 0;
    cols = 0;

    constructor(_rows, _cols) {
        this.rows = _rows;
        this.cols = _cols;
        this.data = new Array(this.rows);
        for (let i = 0; i < this.rows; i++) {
            this.data[i] = new Array(this.cols);
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = Math.random() * 2 - 1;
            }
        }
    }

    add(scaler) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] += scaler;
            }
        }
    }

    addMatrix(matrix) {
        if (this.rows != matrix.rows || this.cols != matrix.cols) {
            console.error("Shape Mismatch");
        } else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] += matrix.data[i][j];
                }
            }
        }
    }

    static subtract(matrix_a, matrix_b) {
        let result = new Matrix(matrix_a.rows, matrix_a.cols);
        for (let i = 0; i < matrix_a.rows; i++) {
            for (let j = 0; j < matrix_a.cols; j++) {
                result.data[i][j] = matrix_a.data[i][j] - matrix_b.data[i][j];
            }
        }
        return result;
    }

    static transpose(matrix) {
        let result = new Matrix(matrix.cols, matrix.rows);
        for (let i = 0; i < matrix.rows; i++) {
            for (let j = 0; j < matrix.cols; j++) {
                result.data[j][i] = matrix.data[i][j];
            }
        }
        return result;
    }

    static multiply(matrix_a, matrix_b) {
        let result = new Matrix(matrix_a.rows, matrix_b.cols);
        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.cols; j++) {
                let sum = 0;
                for (let k = 0; k < matrix_a.cols; k++) {
                    if(!matrix_b.data[k]){
                        console.log("undefined");
                    }
                    sum += matrix_a.data[i][k] * matrix_b.data[k][j];
                }
                result.data[i][j] = sum;
            }
        }
        return result;
    }

    multiplyMatrix(matrix) {
        for (let i = 0; i < matrix.rows; i++) {
            for (let j = 0; j < matrix.cols; j++) {
                this.data[i][j] *= matrix.data[i][j];
            }
        }
    }

    multiply(value) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] *= value;
            }
        }
    }

    sigmoid() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = 1 / (1 + Math.exp(-this.data[i][j]));
            }
        }
    }

    dsigmoid() {
        let result = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                result.data[i][j] = this.data[i][j] * (1 - this.data[i][j]);
            }
        }
        return result;
    }

    static fromArray(array){
        let result = new Matrix(array.length, 1);
        for (let i = 0; i < array.length; i++) {
			result.data[i][0] = array[i];
		}
		return result;
    }

    toArray(){
        let result = [];
        for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				result.push(this.data[i][j]);
			}
		}
		return result;
    }
}
