import copy
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.tree import DecisionTreeClassifier
from xgboost.sklearn import XGBClassifier
from sklearn.metrics import f1_score
from sklearn.ensemble import VotingClassifier
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import random

class FAIndividual:
    def __init__(self,vardim,gene):
        self.vardim=vardim
        self.gene=gene
        self.fitness=0
        self.chrom=None
    def generate(self):
        chooseNum=0
        while chooseNum<1:
            self.chrom = []
            for i in range(len(self.gene)):
                self.chrom.append( random.choice((True,False))  )
            sum=0
            for i in self.chrom:
                if i==True:
                    sum=1
            chooseNum=sum
    def calculateFitness(self):
        #feature_combine = self.chrom
        # x_train = x_train[x_train.columns[feature_combine]]
        train = pd.read_csv("./data/train.csv", sep=',', header=0)
        X = train.drop(labels=['CaseType', 'entid'], axis=1).fillna(0)
        Y = train.loc[:, 'CaseType']
        x_train, x_test, y_train, y_test = train_test_split(X, Y, test_size=0.25)
        ss = StandardScaler()
        X_train = ss.fit_transform(x_train)
        X_test = ss.transform(x_test)
        voting_clf = VotingClassifier(estimators=[
            ('gdbt', GradientBoostingClassifier()),
            ('cart', DecisionTreeClassifier()),
            ('xgb', XGBClassifier())
        ], voting='soft')
        voting_clf.fit(X_train, y_train)
        pre = voting_clf.predict(X_test)
        F1 = f1_score(y_test, pre, average='macro')
        print('firefly F1 ：', F1)
        self.fitness=F1

#Firefly Algorithm：
class FireflyAlgorithm:
    def __init__(self,sizepop,vardim,gene,MAXGEN,params):
        '''
         :param vardim: dimension
         :param gene: gene--task scheduling sequence
         :param MAXGEN: Maximum number of cycles
         :param pareams: parameter [beta,gamma,alpha]
        '''
        self.sizepop=sizepop
        self.vardim = vardim
        self.gene = gene
        self.MAXGEN = MAXGEN
        self.params = params
        self.population = [FAIndividual for i in range(self.sizepop)]
        self.fitness = np.zeros((self.sizepop, 1))
        self.trace = np.zeros((self.MAXGEN, 2))
    def initialize(self):
        for i in range(0,self.sizepop):
            ind=FAIndividual(self.vardim,self.gene)
            ind.generate()
            ind.calculateFitness()
            self.population[i]=ind
            self.fitness[i]=ind.fitness
    def evaluate(self):
        #evaluation of the population fitnesses
        for i in range(0, self.sizepop):
            self.population[i].calculateFitness()
            self.fitness[i]=self.population[i].fitness
    def move(self):
        for i in range(0,self.sizepop):
            for j in range(0,self.sizepop):
                if self.population[i].fitness<self.population[j].fitness:
                    for n in range(self.vardim):
                        if(self.population[i].chrom[n]!=self.population[j].chrom[n]):
                            touzi=random.random()
                            if(touzi<=self.params[1]):
                                self.population[i].chrom[n]=self.population[j].chrom[n]
                    self.population[i].calculateFitness()
                    self.fitness[i]=self.population[i].fitness
    # def randomWind(self):
        for i in range(0,self.sizepop):
            touzi=random.random()
            if(touzi<self.params[2]):
                chooseNum = 0
                while chooseNum < 1:
                    chrom = []
                    for i in range(len(self.gene)):
                        chrom.append(random.choice((True, False)))
                    sum = 0
                    for i in chrom:
                        if i == True:
                            sum = 1
                    self.population[i].chrom = chrom
                    chooseNum = sum

    def printResult(self):
        x=np.arange(0,self.MAXGEN)
        y1=self.trace[:,0]
        y2=self.trace[:,1]
        plt.plot(x, y1, 'r', label='optimal value')
        plt.plot(x, y2, 'g', label='average value')
        plt.xlabel("Iteration")
        plt.ylabel("function value")
        plt.title("Firefly Algorithm for function optimization")
        plt.legend()
        plt.show()
    def solve(self):
        '''
        evolution process of firefly algorithm
        '''
        self.t = 0
        self.initialize()
        self.evaluate()
        best = np.max(self.fitness)
        bestIndex = np.argmax(self.fitness)
        self.best=self.population[bestIndex]
        self.avefitness = np.mean(self.fitness)
        self.trace[self.t,0]=self.best.fitness
        self.trace[self.t,1]=self.avefitness
        print("Generation %d: optimal function value is: %f; average function value is %f" % (
            self.t, self.trace[self.t, 0], self.trace[self.t, 1]))
        while self.t < self.MAXGEN - 1:
            self.t += 1
            self.move()
            self.evaluate()
            best = np.max(self.fitness)
            bestIndex = np.argmax(self.fitness)
            if best>self.best.fitness:#Update best point
                self.best = copy.deepcopy(self.population[bestIndex])
            self.avefitness = np.mean(self.fitness)
            self.trace[self.t, 0] = self.best.fitness
            self.trace[self.t, 1] = self.avefitness
            print("Generation %d: optimal function value is: %f; average function value is %f" % (
                self.t, self.trace[self.t, 0], self.trace[self.t, 1]))
        print("Optimal function value is: %f; " %
              self.trace[self.t, 0])
        print("Optimal solution is:")
        print(self.best.chrom)
        self.printResult()

num_features=60
sizepop = 12

# print(len(x_train))
# #Test whether the calculation of a single firefly can be realized
# genee=[1 for i in range(60)]
# print("genee:",genee)
# littleOne=FAIndividual(num_features,genee)
# littleOne.generate()
# littleOne.calculateFitness()
# littleOne.chrom=[1 for i in range(60)]
# print(littleOne.chrom)
# print(littleOne.fitness)

standred=[1 for i in range(60)]
vardim=num_features
fa=FireflyAlgorithm(sizepop,vardim,standred,10,[1.0,0.1,0.03])
fa.solve()






