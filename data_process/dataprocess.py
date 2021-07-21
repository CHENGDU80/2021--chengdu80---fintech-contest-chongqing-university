'''
This file is using to handle all training data,following the online data structure
'''

import pandas as pd
import numpy as np
from collections import Counter
path = "/Users/songxinyi/Desktop/21chengdu80/Online_Data/trainning_data/corporate_attributes"

def handle_company_base_info(filename):
    data = pd.read_csv(filename,index_col=0)
    data['honor_num'] = data['honor_num'].fillna(data['honor_num'].median())
    data['illegad_num'] = data['illegad_num'].fillna(data['illegad_num'].median())
    data['yea_sub'] = data['yea_sub'].fillna(data['yea_sub'].median())
    data['web_dum'] = data['web_dum'].fillna(data['web_dum'].median())
    data.drop('REGCAP',axis=1, inplace=True)
    data['REGCAPCUR'] = data['REGCAPCUR'].apply(lambda x:1 if x==156 else 0)
    data['RECCAP'] = data['RECCAP'].fillna(data['RECCAP'].median())
    data['PARNUM'] = data['PARNUM'].fillna(data['PARNUM'].median())
    data['LIMPARNUM'] = data['LIMPARNUM'].fillna(data['LIMPARNUM'].median())
    data['PARFORM'] = data['PARFORM'].fillna(data['PARFORM'].median())
    data['EXENUM'] = data['EXENUM'].fillna(data['EXENUM'].median())
    data['brand_num'] = data['brand_num'].fillna(data['brand_num'].median())
    data['cancel_dum'] = data['cancel_dum'].fillna(data['cancel_dum'].median())
    data['certificate_num'] = data['certificate_num'].fillna(data['certificate_num'].median())
    return data

def all_equal(data):
    a = data.to_numpy()
    if (a[0] == a[1:]).all():
        return 0
    else:
        return 1

def handle_company_ar(filename):
    data = pd.read_csv(filename,index_col=0)
    df = data.groupby(by='entid').agg({'EMPNUM':np.mean,'WOMEMPNUM':np.mean})
    df['BUSST'] = data.groupby(by='entid').apply(lambda df: all_equal(df) )
    return df
def handle_company_ar_assetsinfo(filename):
    data = pd.read_csv(filename,index_col=0)
    df = data.groupby(by='entid').agg({'ASSGRO':np.mean,'LIAGRO':np.mean,
                                       'VENDINC':np.mean,'MAIBUSINC':np.mean,
                                       'PROGRO':np.mean,'NETINC':np.mean,
                                       'RATGRO':np.mean,'TOTEQU':np.mean})
    df['ispublic'] = data.groupby(by='entid').apply(lambda df: all_equal(df))
    return df
def handle_company_ar_nz(filename):
    data = pd.read_csv(filename,index_col=0)
    df = data.groupby(by='entid').agg({'MEMNNUM': np.mean, 'FARNUM': np.mean,
                                       'ANNNEWMEM': np.mean, 'ANNREDMEM': np.mean})
    df['MEMNNUM'] = df.fillna(df['MEMNNUM'].median())
    df['FARNUM'] = df.fillna(df['FARNUM'].median())
    df['ANNNEWMEM'] = df.fillna(df['ANNNEWMEM'].median)
    return df
def handle_tax_abnormal(filename):
    data = pd.read_csv(filename)
    print(data.entid)
    data.drop('cdate',axis=1, inplace=True)
    print(data.entid)
    data.drop_duplicates(subset=['entid'], keep='first', inplace=True)
    return data

def handle_company_ar_alterstockinfo(filename):
    df = pd.read_csv(filename)
    df = df.sort_values("entid")
    df1 = df.groupby(by='entid').agg({'INV': np.count_nonzero, 'TRANSAMPR': np.mean, 'TRANSAMAFT': np.mean})
    df1['SUB'] = df1['TRANSAMAFT'] - df1['TRANSAMPR']
    df1['SUB'] = df1['SUB'].fillna(df1['SUB'].median())
    df1['INV'] = df1['INV'].fillna(df1['INV'].median())
    return df1[['INV', 'SUB']]

def handle_company_modify(filename):
    data = pd.read_csv(filename)
    data = data.fillna(0)
    data.drop('ALTDATE',axis=1, inplace=True)
    data.drop_duplicates(subset=['entid'],keep='first', inplace=True)
    return data

def handle_el_company_history_inv(filename):
    df = pd.read_csv(filename)
    def type_not_4(x):
        return len(x) - Counter(x)[4]
    def type_4(x):
        return Counter(x)[4]
    df3 = df.groupby("entid").agg({"ttype": [type_not_4, type_4]})
    df3.columns = df3.columns.droplevel()
    print(df3)
    return df3

def handle_el_company_history_manager(filename):
    df = pd.read_csv(filename)
    table = pd.pivot_table(df, index=["entid"], values=["NAME"], aggfunc=len, fill_value=0)
    return table

def tool1(name,l,temp):
    flag = 0
    for index, row in temp.iterrows():
        if not pd.isnull(row[name]):
            flag = 1
            l.append(row[name])
            break
    if flag==0:
        l.append(np.nan)
    return l
def handle_tax_company(filename):
    tax_company = pd.read_csv(filename)
    new_tax_company = pd.DataFrame(columns=(
    'entid', 'region_id', 'entertype_tax', 'industry_tax', 'registertype', 'economic_type', 'incometax_rate',
    'collection_type', 'avg_EMPNUM', 'std_EMPNUM'))
    entid = tax_company['entid'].unique().tolist()
    print(len(entid))
    print(type(entid))
    for i in entid:
        l = []
        temp = tax_company.loc[tax_company['entid'] == i]

        l.append(i)
        if (all_equal(temp.region_id)):
            l.append(temp.region_id.iloc[0])
        else:
            l.append(0)
        l = tool1('entertype_tax', l, temp)
        l = tool1('industry_tax', l, temp)
        l = tool1('registertype', l, temp)
        l = tool1('economic_type', l, temp)
        l = tool1('incometax_rate', l, temp)
        l = tool1('collection_type', l, temp)

        avg_EMPNUM = temp.EMPNUM.mean()
        std_EMPNUM = temp.EMPNUM.std()
        l.append(avg_EMPNUM)
        l.append(std_EMPNUM)
        new_tax_company.loc[len(new_tax_company)] = l
    return new_tax_company

def handle_tax_year(filename):
    df = pd.read_csv(filename,index_col=0)
    df1 = df.groupby(by='entid').agg({'islatest': np.max,
                                            'profit_loss': np.mean, 'revenue': np.mean, 'sales_cost': np.mean,
                                            'sales_tax': np.mean, 'sales_expense': np.mean, 'G_expense': np.mean,
                                            'finance_expense': np.mean, 'asset_devaluation_losses': np.mean,
                                            'fair_value_change': np.mean, 'investment_income': np.mean,
                                            'operation_profit': np.mean, 'non_operating_income': np.mean,
                                            'non_operating_expense': np.mean, 'total_profit': np.mean,
                                            'assets': np.mean, 'assets_re': np.mean, 'payrol_expense': np.mean,
                                            'welfare_expenses': np.mean, 'education_expenses': np.mean,
                                            'union_funds': np.mean, 'ad_expenses': np.mean,
                                            'entertainment_expenses': np.mean,
                                            'assets_loss': np.mean, 'asset_devaluation_allowance': np.mean,
                                            'main_business_income': np.mean, 'main_business_cost': np.mean,
                                            'other_business_income': np.mean, 'other_operating_cost': np.mean,
                                            'retained_profits': np.mean, 'gross_profit': np.mean,
                                            'main_business_gross': np.mean,
                                            'income_tax_adjuste': np.mean, 'income_taxable': np.mean,
                                            'incometax_taxable': np.mean,
                                            'incometax_amount': np.mean, 'incometax_actual': np.mean})
    df1 = df1.fillna(0)
    df1["welfare_expenses"] = df1["welfare_expenses"].map(lambda x: 1 if x != 0 else 0)
    df1["education_expenses"] = df1["education_expenses"].map(lambda x: 1 if x != 0 else 0)
    df1["union_funds"] = df1["union_funds"].map(lambda x: 1 if x != 0 else 0)
    df1["ad_expenses"] = df1["ad_expenses"].map(lambda x: 1 if x != 0 else 0)
    df1["entertainment_expenses"] = df1["entertainment_expenses"].map(lambda x: 1 if x != 0 else 0)
    df1["assets_loss"] = df1["assets_loss"].map(lambda x: 1 if x != 0 else 0)
    df1["asset_devaluation_allowance"] = df1["asset_devaluation_allowance"].map(lambda x: 1 if x != 0 else 0)
    return df1




out_path = "./newdata"
handle_company_base_info(path+"/"+"company_base_info.csv").to_csv(out_path+"/company_base_info.csv")
handle_company_ar(path+"/"+"company_ar.csv").to_csv(out_path+"/company_ar.csv")
handle_company_ar_assetsinfo(path+"/"+"company_ar_assetsinfo.csv").to_csv(out_path+"/company_ar_assetsinfo")
handle_company_ar_nz(path+"/"+"company_ar_nz.csv").to_csv(out_path+"/company_ar_nz.csv")
handle_tax_abnormal(path+"/"+"tax_abnormal.csv").to_csv(out_path+"/tax_abnormal.csv")
handle_company_ar_alterstockinfo(path+"/"+"company_ar_alterstockinfo.csv").to_csv(out_path+"/company_ar_alterstockinfo.csv")
handle_company_modify(path+"/"+"company_modify.csv").to_csv(out_path+"/company_modify.csv")
handle_el_company_history_inv(path+"/"+"el_company_history_inv.csv").to_csv(out_path+"/el_company_history_inv.csv")
handle_el_company_history_manager(path+"/"+"el_company_history_manager.csv").to_csv(out_path+"/el_company_history_manager.csv")
handle_tax_company(path+"/"+"tax_company.csv").to_csv(out_path+"/tax_company.csv",index=False)
handle_tax_year(path+"/"+"tax_year.csv").to_csv(out_path+"/tax_year.csv")


