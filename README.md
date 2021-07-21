# FASR--foresee risk, avoid risk, solve risk

## Overview

This is the solution of 2021 chengdu80 competition. In this competition, we provide a new finance product--FASR. Our aim is to foresee risk, avoid risk and solve risk. The code repository can be divided into three parts: data preprocessing, algorithm design and website design.

## Data Prepocessing

The dataset has 14 tables, more than 130 features.

In this part, we apply two methods

For missing values, we delete or fill the data according to the specific situation。

For data with year, we calculate the mean, difference, variance and other statistical indicators between years.

You can see detailed information in dataprocess.py

## Feature Extraction

In this part, we use intelligent algorithm: **Genetic Algorithm** and **Firefly Algorithm**. The examples are in the next two pictures:

<img src="/Users/songxinyi/2021--chengdu80---fintech-contest-chongqing-university/image-20210721033658210.png" alt="image-20210721033658210" style="zoom:50%;" />

<img src="/Users/songxinyi/2021--chengdu80---fintech-contest-chongqing-university/image-20210721033717917.png" alt="image-20210721033717917" style="zoom:50%;" />

You can see more detailed information in the Feature Extraction folder

## Classification Model

In this part, we apply seven machine learning algorithms, finally we use

* Gradient descent tree

* classification regression tree 

* xgboost algorithm

 you can see detailed information in the Model Folder

For parameter optimization, we use GridSearchCV

Then, we use voting mechanism to realize model fusion.

At last, we propose an innovative Forward multilayer model and get the best results

## Website Design

We design a user friendly, visually appealing website.

The main function of our website is:

* search company ID and show basic company information
* judge risk type and level
* show feature indicator
* give apposite tips