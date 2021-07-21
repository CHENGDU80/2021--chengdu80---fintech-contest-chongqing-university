import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler

entid=1154188320
df = pd.read_csv("./data/train.csv", sep=',', header=0)
X = df.drop(labels=['CaseType','entid'], axis=1).fillna(0)
ss = StandardScaler()
X_train = ss.fit_transform(X)

for i in range(df.shape[0]):
    if(df['entid'][i]==entid):
        rd = joblib.load('model/model.pkl')
        pre = rd.predict(X_train)
        # Return result
        print(pre[i])
        # Returns the probability that the prediction belongs to the label
        print(rd.predict_proba(X_train)[i])