import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier,GradientBoostingClassifier
from sklearn.tree import DecisionTreeClassifier
from xgboost.sklearn import XGBClassifier
from sklearn.metrics import precision_score
from sklearn.metrics import recall_score
from sklearn.metrics import f1_score
from sklearn.ensemble import VotingClassifier
from sklearn.model_selection import train_test_split
import joblib

train = pd.read_csv("./data_train/234.csv", sep=',', header=0)
X = train.drop(labels=['CaseType','entid','id'], axis=1).fillna(0)
Y = train.loc[:, 'CaseType']
x_train, x_test, y_train, y_test = train_test_split(X, Y, test_size=0.001 )
ss = StandardScaler()
X_train = ss.fit_transform(x_train)
X_test = ss.transform(x_test)

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
joblib.dump(voting_clf, './model/234.pkl')
