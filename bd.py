
import pymysql

def obtener_conexion():
  return pymysql.connect(host='parroquia-julonerick1-1f47.k.aivencloud.com',
                          user='avnadmin',                           
                          password='AVNS_IHAfaHy1gZL4PSuDJ6H',
                         db='parroquia',
                         port=24299)

# def obtener_conexion():
#    return pymysql.connect(host='localhost',
#                            user='root',                           
#                            password='',
#                           db='bd_local')



#def obtener_conexion():
 #  return pymysql.connect(host='http://bi6yujzliexasotkyegr-mysql.services.clever-cloud.com',
  #                        user='uim2tokwfrpakopm',
   #                       password='prXohu1mxCpMGr63Eu35',
    #                      db='bi6yujzliexasotkyegr')