import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import precision_score
from sklearn.metrics import recall_score
from sklearn.metrics import f1_score
from sklearn.model_selection import KFold
from sklearn.model_selection import cross_val_score

df = pd.read_csv("../data/test_x.csv", sep=',', header=0)
X = df.drop(labels=['entid'], axis=1).fillna(0)
ss = StandardScaler()
X_train = ss.fit_transform(X)

# df1 = pd.read_csv("./train_new.csv", sep=',', header=0)
# #X = df.drop(labels=['entid'], axis=1).fillna(0)
# X1 = df1.drop(labels=['CaseType','id','entid'], axis=1).fillna(0)
# Y1 = df1.loc[:, 'CaseType']
# Y11 = df1.loc[:, 'entid']
# ss = StandardScaler()
# X_train1 = ss.fit_transform(X1)
#
# df = pd.read_csv("./train.csv", sep=',', header=0)
# #X = df.drop(labels=['entid'], axis=1).fillna(0)
# X = df.drop(labels=['CaseType','id','entid'], axis=1).fillna(0)
# Y = df.loc[:, 'CaseType']
# Y1 = df.loc[:, 'entid']
# ss = StandardScaler()
# X_train = ss.fit_transform(X)

rd = joblib.load('model/model.pkl')
rd04 = joblib.load('model/04.pkl')
rd14 = joblib.load('model/14.pkl')
rd24 = joblib.load('model/24.pkl')
rd34 = joblib.load('model/34.pkl')
rd014 = joblib.load('model/014.pkl')
rd024 = joblib.load('model/024.pkl')
rd034 = joblib.load('model/034.pkl')
rd124 = joblib.load('model/124.pkl')
rd134 = joblib.load('model/134.pkl')
rd234 = joblib.load('model/234.pkl')

pre = rd.predict(X_train)
pre04 = rd04.predict(X_train)
pre14 = rd14.predict(X_train)
pre24 = rd24.predict(X_train)
pre34 = rd34.predict(X_train)
pre014 = rd014.predict(X_train)
pre024 = rd024.predict(X_train)
pre034 = rd034.predict(X_train)
pre124 = rd124.predict(X_train)
pre134 = rd134.predict(X_train)
pre234 = rd234.predict(X_train)

count=0
count1=0
list=[0]*df.shape[0]
for i in range(df.shape[0]):
    if(pre04[i]==pre[i]==pre014[i]==pre024[i]==pre034[i] or
       pre14[i]==pre[i]==pre014[i]==pre124[i]==pre134[i] or
       pre24[i]==pre[i]==pre024[i]==pre124[i]==pre234[i] or
       pre34[i]==pre[i]==pre034[i]==pre134[i]==pre234[i]):
        list[i]=pre[i]
        # count = count + 1
        # if (Y[i] == list[i]):
        #     count1 = count1 + 1
        # else:
        #     #print(Y[i], list[i])
        #     print(Y1[i])
    elif(pre[i]==pre014[i]==pre024[i]==pre034[i] or
         pre[i]==pre014[i]==pre124[i]==pre134[i] or
         pre[i]==pre024[i]==pre124[i]==pre234[i] or
         pre[i]==pre034[i]==pre134[i]==pre234[i]):
        list[i]=pre[i]
        # count = count + 1
        # if (Y[i] == list[i]):
        #     count1 = count1 + 1
        # else:
        #     # print(Y[i], list[i])
        #     print(Y1[i])
    elif (pre[i] == pre04[i] or
          pre[i] == pre14[i] or
          pre[i] == pre24[i] or
          pre[i] == pre34[i]):
        list[i] = pre[i]
        # count = count + 1
        # if (Y[i] == list[i]):
        #     count1 = count1 + 1
        # else:
        #     # print(Y[i], list[i])
        #     print(Y1[i])
    elif(pre034[i] == pre134[i] == pre234[i] == 3):
        list[i] = 3
        # count = count + 1
        # if (Y[i] == list[i]):
        #     count1 = count1 + 1
        # else:
        #     # print(Y[i], list[i])
        #     print(Y1[i])
    elif(pre024[i] == pre124[i] == pre234[i] == 2 ):
         list[i]=2
         # count = count + 1
         # if (Y[i] == list[i]):
         #     count1 = count1 + 1
         # else:
         #     # print(Y[i], list[i])
         #     print(Y1[i])
    elif(pre014[i] == pre124[i] == pre134[i] == 1 ):
        list[i]=1
        # count = count + 1
        # if (Y[i] == list[i]):
        #     count1 = count1 + 1
        # else:
        #     # print(Y[i], list[i])
        #     print(Y1[i])
    elif(pre014[i] == pre024[i] == pre034[i] == 0 ):
         list[i]=0
         # count = count + 1
         # if (Y[i] == list[i]):
         #     count1 = count1 + 1
         # else:
         #     # print(Y[i], list[i])
         #     print(Y1[i])
    elif (pre34[i] == 3):
        list[i] = 3
        # count = count + 1
        # if (Y[i] == list[i]):
        #     count1 = count1 + 1
        # else:
        #     # print(Y[i], list[i])
        #     print(Y1[i])
    elif(pre24[i]==2):
         list[i]=2
         # count = count + 1
         # if (Y[i] == list[i]):
         #     count1 = count1 + 1
         # else:
         #     # print(Y[i], list[i])
         #     print(Y1[i])
    elif(pre14[i]==1):
        list[i]=1
        # count = count + 1
        # if (Y[i] == list[i]):
        #     count1 = count1 + 1
        # else:
        #     # print(Y[i], list[i])
        #     print(Y1[i])
    elif(pre04[i]==0):
         list[i]=0
         # count = count + 1
         # if (Y[i] == list[i]):
         #     count1 = count1 + 1
         # else:
         #     # print(Y[i], list[i])
         #     print(Y1[i])
    else:
        list[i]=pre[i]
        # count = count + 1
        # if (Y[i] == list[i]):
        #     count1 = count1 + 1
        # else:
        #     # print(Y[i], list[i])
        #     print(Y1[i])
# print(count)
# print(count1)
# print(count1/count)
# precision = precision_score(Y, list, average='macro')
# recall = recall_score(Y, list, average='macro')
# F1 = f1_score(Y, list, average='macro')
# print('precision为：',precision)
# print('recall为：',recall)
# print('F1 ：' ,F1)
#
# precision = precision_score(Y, pre, average='macro')
# recall = recall_score(Y, pre, average='macro')
# F1 = f1_score(Y, pre, average='macro')
# print('precision为：',precision)
# print('recall为：',recall)
# print('F1 ：' ,F1)

# kfold = KFold(n_splits=10)
# result = cross_val_score(rd ,X_train, Y , cv=kfold,scoring='f1_macro')
# print(result.mean())

df1 = pd.DataFrame(list)
df2 = pd.read_csv('../data/test_y.csv')
dataframe = df2.join(df1)
dataframe.to_csv('./test_y.csv',index=False,mode='w',sep=',')
print(df1)