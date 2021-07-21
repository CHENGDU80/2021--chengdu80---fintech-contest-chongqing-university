import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler

df = pd.read_csv("../data/train.csv", sep=',', header=0)
X = df.drop(labels=['CaseType','entid'], axis=1).fillna(0)
ss = StandardScaler()
X_train = ss.fit_transform(X)

rd = joblib.load('model/model.pkl')
rd04 = joblib.load('model/04.pkl')
rd14 = joblib.load('model/14.pkl')
rd24 = joblib.load('model/24.pkl')
rd34 = joblib.load('model/34.pkl')

pre = rd.predict(X_train)
pre04 = rd04.predict(X_train)
pre14 = rd14.predict(X_train)
pre24 = rd24.predict(X_train)
pre34 = rd34.predict(X_train)

count=0
list=[0]*df.shape[0]
for i in range(df.shape[0]):
    if (pre04[i]==pre14[i]==pre24[i]==pre34[i]):
        list[i]=4
        count=count+1
    else:
        list[i]=pre[i]
print(count)
print(list)
df1 = pd.DataFrame(list)

# Append the column of df1 to the back of df2
df2 = pd.read_csv('./result.csv')
dataframe = df2.join(df1)
dataframe.to_csv('./result.csv',index=False,mode='w',sep=',')
print(df1)