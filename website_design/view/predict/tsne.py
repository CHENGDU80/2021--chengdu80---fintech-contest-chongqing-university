from sklearn.manifold import TSNE
from sklearn.datasets import load_iris
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import pandas as pd

data = pd.read_csv("view/predict/all_feature719_3.csv")
y = data.CaseType
data = data.iloc[:, 5:]
print(data.shape)
X_tsne = TSNE(learning_rate=100).fit_transform(data)
X_pca = PCA().fit_transform(data)

print(X_tsne.shape)
plt.figure(figsize=(10, 5))
plt.scatter(X_tsne[:, 0], X_tsne[:, 1], c=y)
plt.show()
