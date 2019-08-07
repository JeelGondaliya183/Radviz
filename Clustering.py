import pandas as pd
import numpy as np
from sklearn import preprocessing
from sklearn.cluster import DBSCAN

wine_red = pd.read_csv('./winequality-red.csv')
wine_red_cluster = pd.read_csv('./winequality-red.csv')
wine_white = pd.read_csv('./winequality-white.csv')
wine_white_cluster = pd.read_csv('./winequality-white.csv')

#normalizing red_wine data
train_norm = wine_red
std_scale = preprocessing.StandardScaler().fit(train_norm)
x_train_norm = std_scale.transform(train_norm)
training_norm_col = pd.DataFrame(x_train_norm, index=train_norm.index, columns=train_norm.columns) 
normalized_data = wine_red.update(training_norm_col)

#noramalizing white wine data
train_norm = wine_white
std_scale = preprocessing.StandardScaler().fit(train_norm)
x_train_norm = std_scale.transform(train_norm)
training_norm_col = pd.DataFrame(x_train_norm, index=train_norm.index, columns=train_norm.columns) 
normalized_data = wine_white.update(training_norm_col)

#implementing K-means algorithm for red-wine data
dbscan_red = DBSCAN().fit(wine_red)

#implementing K-means algorithm for white-wine data
dbscan_white = DBSCAN().fit(wine_white)

db_labels_red = dbscan_red.labels_
db_labels_white = dbscan_white.labels_

# attching all the labels for each row in dataframe for red_wine data
array = np.array(db_labels_red)
wine_red_cluster['labels'] = array

# attching all the labels for each row in dataframe for white_wine data
array = np.array(db_labels_white)
wine_white_cluster['labels'] = array

wine_red_cluster.to_csv('./Wine_Red_Cluster.csv',index=False,header=None)
wine_white_cluster.to_csv('./Wine_white_Cluster.csv', index=False,header=None)