import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler


def predict(entid=1154188320, model='fusion'):

    df = pd.read_csv("view/predict/all_feature719_3.csv", sep=',', header=0)
    X = df.drop(labels=['CaseType', 'entid'], axis=1).fillna(0)
    ss = StandardScaler()
    X_train = ss.fit_transform(X)
    for i in range(df.shape[0]):
        if(df['entid'][i] == entid):
            print("loadding model ...")
            if model == 'fusion':
                rd = joblib.load('view/predict/model.pkl')
            elif model == 'cart':
                rd = joblib.load('view/predict/model_cart.pkl')
            elif model == 'gdbt':
                rd = joblib.load('view/predict/model_gdbt.pkl')
            elif model == 'xgboost':
                rd = joblib.load('view/predict/model_xgb.pkl')
            else:
                print("please input correct model name")
            print("predictting ...")
            pre = rd.predict(X_train)
            # 返回结果
            print(pre[i])
            # 返回预测属于标签的概率
            print(rd.predict_proba(X_train)[i])
            result = {}
            result['type'] = pre[i]
            result['pro'] = rd.predict_proba(X_train)[i]
            return result
