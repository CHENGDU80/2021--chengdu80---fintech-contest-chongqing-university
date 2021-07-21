import os
import pandas as pd
import numpy as np



# for file in filename:
#     data = pd.read_csv(path+"/"+file)
#     print(file,data.shape)
path = "/Users/songxinyi/Desktop/21chengdu80/new_data"
filename = os.listdir(path)
print(filename)
corporate = pd.read_csv("/Users/songxinyi/Desktop/21chengdu80/Online_Data/trainning_data/label_risk_company.csv")
print(corporate.shape)
for name in filename:
    if name==".DS_Store":
        continue
    temp = pd.read_csv(path+"/"+name)
    corporate = pd.merge(corporate, temp, how='left', on='entid')
    print(name)
    print(corporate.shape)
corporate.to_csv("all_feature719.csv")

data = pd.read_csv("all_feature719.csv")
df = data.fillna(0)
a = (df == 0).astype(int).sum(axis=0) / len(df)
print(type(a))
for i, v in a.items():
    if v>0.8:
        data.drop(i,axis=1, inplace=True)
data = data.fillna(data.median())
data.to_csv("all_feature720.csv")