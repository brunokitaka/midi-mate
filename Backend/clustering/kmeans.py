import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
sns.set()
from sklearn.cluster import KMeans
from sklearn import preprocessing

# read csv input file
data = pd.read_csv("./clustering/extracted_feature_values.csv", sep=",")

# Clustering:
wcss = []
x = pd.DataFrame(data,columns=["Melodic_Pitch_Variety", "Rhythmic_Variability"])
x_scaled = preprocessing.scale(x)

kmeans = KMeans(3)
kmeans.fit(x_scaled)
predict = kmeans.fit_predict(x_scaled)
data['cluster'] = predict

data.to_csv('./clustering/predict.csv',sep=',')