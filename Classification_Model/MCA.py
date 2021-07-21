import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier,GradientBoostingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from xgboost.sklearn import XGBClassifier
from sklearn.metrics import precision_score
from sklearn.metrics import recall_score
from sklearn.metrics import f1_score
from sklearn.model_selection import KFold
from sklearn.model_selection import cross_val_score
from sklearn.preprocessing import normalize
from sklearn.preprocessing import LabelEncoder
from imblearn.under_sampling import RandomUnderSampler
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import GridSearchCV
import joblib
import numpy

train = pd.read_csv("./data/train.csv", sep=',', header=0)
X = train.drop(labels=['CaseType','entid','id'], axis=1).fillna(0)
Y = train.loc[:, 'CaseType']
x_train, x_test, y_train, y_test = train_test_split(X, Y, test_size=0.01 )
ss = StandardScaler()
X_train = ss.fit_transform(x_train)
X_test = ss.transform(x_test)

model={}
## Comparison of machine learning algorithms
# model['rfc']=RandomForestClassifier()
# model['gdbt']=GradientBoostingClassifier()
# model['cart']=DecisionTreeClassifier()
# model['knn']=KNeighborsClassifier()
# model['svm']=svm.SVC()
# model['lr']=LogisticRegression()
# model['xgb']=XGBClassifier()

# Separate model without optimization
# for i in model:
#     model[i].fit(X_train, y_train)
#     pre = model[i].predict(X_test)
#     #quan = model[i].predict_proba(X_test)
#     #print(quan)
#     # precision = precision_score(y_test, pre, average=None)
#     # recall = recall_score(y_test, pre, average=None)
#     # print(precision)
#     # print(recall)
#     precision = precision_score(y_test, pre, average='macro')
#     recall = recall_score(y_test, pre, average='macro')
#     F1 = f1_score(y_test, pre, average='macro')
#     print('%s precision：%.3f'%(i,precision))
#     print('%s recall：%.3f' % (i, recall))
#     print('%s F1 ：%.3f' % (i, F1))
#     joblib.dump(model[i], 'model_xgb.pkl')
#     N_Test = ss.fit_transform(Test)
#     pre = model[i].predict(N_Test)
#     print(pre)


# #Parameter optimization
# model=['gdbt','cart','xgb']
# temp=[]

# gdbt=GradientBoostingClassifier()
# params={'n_estimators':[50,100,150,200,250],'max_depth':[3,5,7],'min_samples_leaf':[2,4,6]}
# temp.append([gdbt,params])
#
# svm=svm.SVC()
# params={'C':[0.2,1,5],'kernel':['linear','poly','rbf','sigmoid'],'gamma':[0.01,1,5]}
# temp.append([svm,params])
#
# lr=LogisticRegression()
# params={'C':[0.01,0.1,0.5,1,2,3,4,5,6],'solver':['newton-cg','lbfgs','sag']}
# temp.append([lr,params])
#
# xgb=XGBClassifier()
# params = {'max_depth':range(2, 7), 'n_estimators':range(100, 1100, 200), 'learning_rate':[0.05, 0.1, 0.25, 0.5, 1.0]}
# temp.append([xgb,params])
#
# for i in range(len(model)):
#     best_model=GridSearchCV(temp[i][0],param_grid=temp[i][1],refit=True,cv=5).fit(X_train, y_train)
#     print(model[i],':')
#     print('best parameters:',best_model.best_params_)


# # Result after parameter optimization
# model={}
# model['rfc']=RandomForestClassifier(max_depth=3,min_samples_leaf=2,n_estimators=50)
#model['svm']=svm.SVC(kernel='linear', class_weight={0: 24, 1: 24,2: 12,3: 2.4}, C=1.0, random_state=0)
# model['lr']=LogisticRegression(C=0.01,solver='newton-cg')
# #model['xgb']=XGBClassifier(max_depth=,n_estimators=,learning_rate=)
#
# for i in model:
#     model[i].fit(X_train, y_train)
#     pre = model[i].predict(X_test)
#     precision = precision_score(y_test, pre, average='weighted')
#     recall = recall_score(y_test, pre, average='weighted')
#     print('%s的precision为：%.3f' % (i, precision))
#     print('%s的recall为：%.3f' % (i, recall))
#     #N_Test = ss.fit_transform(Test)
#     #pre = model[i].predict(N_Test)
#     # Return result
#     #print(pre)
#     # Returns the probability that the prediction belongs to the label
#     #print(model[i].predict_proba(N_Test))


# Use voting in the integrated model
from sklearn.ensemble import VotingClassifier
voting_clf = VotingClassifier(estimators=[
    ('gdbt',GradientBoostingClassifier()),
    ('cart',DecisionTreeClassifier()),
     ('xgb',XGBClassifier())
], voting='soft')
voting_clf.fit(X_train, y_train)
pre = voting_clf.predict(X_test)
print(pre)
precision = precision_score(y_test, pre, average='macro')
recall = recall_score(y_test, pre, average='macro')
F1 = f1_score(y_test, pre, average='macro')
print('precision为：',precision)
print('recall为：',recall)
print('F1 ：' ,F1)

# Convert to model
joblib.dump(voting_clf, 'model/model.pkl')
#data_train=voting_clf.predict_proba(X1)


# N_Test = ss.fit_transform(Test)
# pre = voting_clf.predict(N_Test)
# print(pre)
# data_predict=pd.DataFrame({'class':pre})
# print(data_predict)

# #Append column
# df1 = pd.read_csv('./history.csv')
# dataframe = df1.join(data_predict)
# dataframe.to_csv('./history.csv',index=False,mode='w',sep=',')







