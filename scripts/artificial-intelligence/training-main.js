let parameters = {
    areaSize: 16,
    populationSize: 10,
    percentEliteChromosomes: 0.1,
    percentTournamentSelection: 0.4,
    mutationRate: 0.25,
    neuralLayers: [256, 128, 64, 32, 16, 8, 4],
    learningRate: 0.01
}
let manager = new TrainingManager(parameters);