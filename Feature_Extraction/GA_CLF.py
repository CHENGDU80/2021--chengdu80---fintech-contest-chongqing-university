#coding=utf-8
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from xgboost.sklearn import XGBClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import GradientBoostingClassifier
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from Feature_selection import GA as tfg
from sklearn.ensemble import VotingClassifier
from sklearn.metrics import precision_score
from sklearn.metrics import recall_score
from sklearn.metrics import f1_score

train = pd.read_csv("./data/train.csv", sep=',', header=0)
X = train.drop(labels=['CaseType','id','entid'], axis=1).fillna(0)
Y = train.loc[:, 'CaseType']
x_train, x_test, y_train, y_test = train_test_split(X, Y, test_size=0.25)
ss = StandardScaler()
X_train = ss.fit_transform(x_train)
X_test = ss.transform(x_test)

#Initialize params for GA
generation = 0
population = 8
num_features = 137
feature_combines = []
fitness_ls = []
MAXGEN=20
trace = np.zeros((MAXGEN, 2))

#Train the model by GA(feature selection) and SVM

while generation<MAXGEN:
    print('\n')
    print('Generation: ', generation)
    #Update train and test by each feature combination
    feature_combines = tfg.feature_selection(population, num_features, feature_combines, fitness_ls)
    fitness_ls = []
    for feature_combine in feature_combines:
        try:
            voting_clf = VotingClassifier(estimators=[
                ('gdbt', GradientBoostingClassifier()),
                ('cart', DecisionTreeClassifier()),
                ('xgb', XGBClassifier())
            ], voting='soft')
            voting_clf.fit(X_train, y_train)
            pre = voting_clf.predict(X_test)
            precision = precision_score(y_test, pre, average='macro')
            recall = recall_score(y_test, pre, average='macro')
            F1 = f1_score(y_test, pre, average='macro')
            print('precision为：%.3f'%(precision))
            print('的recall为：%.3f' % (recall))
            print(f1_score(y_test, pre, average=None))
            fitness_ls.append(F1)
            #print('Score: ', score)
        except Exception as e:
            print(e)
            score = 0
            fitness_ls.append(score)
    trace[generation, 0] = max(fitness_ls)
    trace[generation, 1] =(sum(fitness_ls)/len(fitness_ls))
    print('Max score: ', max(fitness_ls))
    print('Average score: ', sum(fitness_ls) / len(fitness_ls))
    print('Min score: ', min(fitness_ls))
    print(feature_combines[fitness_ls.index(max(fitness_ls))])

    # if max(fitness_ls) > 0.8 and sum(fitness_ls) / len(fitness_ls) > 0.77:
    #     print(feature_combines[fitness_ls.index(max(fitness_ls))])
    #     break
    generation += 1

x=np.arange(0,MAXGEN)
y1=trace[:,0]
y2=trace[:,1]
plt.plot(x, y1, 'r', label='optimal value')
plt.plot(x, y2, 'g', label='average value')
plt.xlabel("Iteration")
plt.ylabel("function value")
plt.title("Genetic Algorithm for function optimization")
plt.legend()
plt.show()