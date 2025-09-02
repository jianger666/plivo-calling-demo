#!/usr/bin/env python3
"""
Plivo JWT Token Generator Demo
生成用于Plivo Browser SDK登录的JWT token
"""

import jwt
import time
import json
from datetime import datetime, timedelta

# Plivo 账户凭据 - 从环境变量读取
AUTH_ID = os.getenv("PLIVO_AUTH_ID")
AUTH_TOKEN = os.getenv("PLIVO_AUTH_TOKEN")

# Endpoint 用户名 - 从环境变量读取
ENDPOINT_USERNAME = os.getenv("PLIVO_ENDPOINT_USERNAME")

# 验证必需的环境变量
if not AUTH_ID or not AUTH_TOKEN or not ENDPOINT_USERNAME:
    print("❌ 错误：缺少必需的环境变量")
    print("请设置以下环境变量：")
    print("- PLIVO_AUTH_ID")
    print("- PLIVO_AUTH_TOKEN")
    print("- PLIVO_ENDPOINT_USERNAME")
    print("\n或者创建 .env 文件并设置这些变量")
    exit(1)

def generate_plivo_jwt_token():
    """
    生成Plivo JWT token
    
    Returns:
        str: JWT token字符串
    """
    
    # 当前时间
    now = int(time.time())
    
    # Token有效期（24小时）
    expiry = now + (24 * 60 * 60)
    
    # 使用正确的JWT格式 (基于官方文档)
    app_id = "37402553429571222"  # Plivo Application ID
    
    # JWT payload (简化版本，移除可能导致SDK内部错误的字段)
    payload = {
        "iss": AUTH_ID,                     # Auth ID (发行者)
        "sub": ENDPOINT_USERNAME,           # Endpoint用户名 (关键!)
        "exp": expiry,                      # 过期时间
        "nbf": now,                         # 生效时间
        "iat": now,                         # 签发时间
        # "jti": f"{ENDPOINT_USERNAME}-{now}", # 移除JWT ID，可能导致SDK内部错误
        "app": app_id,                      # Application ID (关键!)
        "per": {                            # 使用per字段（已证明是正确的权限字段）
            "voice": {
                "incoming_allow": True,
                "outgoing_allow": True
            }
        }
    }
    
    # Plivo特有的JWT header
    headers = {
        "cty": "plivo;v=1",  # Plivo特有的content type
        "typ": "JWT",
        "alg": "HS256"
    }
    
    # 使用HS256算法和Auth Token作为密钥生成JWT
    token = jwt.encode(
        payload=payload,
        key=AUTH_TOKEN,
        algorithm="HS256",
        headers=headers
    )
    
    return token

def decode_and_verify_token(token):
    """
    解码和验证JWT token
    
    Args:
        token (str): JWT token字符串
    
    Returns:
        dict: 解码后的payload
    """
    try:
        # 解码token (不验证签名，仅用于调试)
        decoded = jwt.decode(
            token,
            options={"verify_signature": False}
        )
        return decoded
    except Exception as e:
        print(f"解码错误: {e}")
        return None

if __name__ == "__main__":
    print("🎯 Plivo JWT Token Generator")
    print("=" * 50)
    
    print(f"Auth ID: {AUTH_ID}")
    print(f"Auth Token: {AUTH_TOKEN[:10]}...")  # 只显示前10个字符
    print(f"Endpoint Username: {ENDPOINT_USERNAME}")
    print()
    
    # 生成token
    print("🔧 正在生成JWT token...")
    token = generate_plivo_jwt_token()
    
    print("✅ JWT Token生成成功！")
    print("-" * 50)
    print("JWT Token:")
    print(token)
    print()
    
    # 解码验证
    print("🔍 解码验证token内容:")
    decoded = decode_and_verify_token(token)
    if decoded:
        print(json.dumps(decoded, indent=2, ensure_ascii=False))
        
        # 检查时间
        exp_time = datetime.fromtimestamp(decoded['exp'])
        nbf_time = datetime.fromtimestamp(decoded['nbf'])
        
        print(f"\n⏰ Token时间信息:")
        print(f"生效时间: {nbf_time}")
        print(f"过期时间: {exp_time}")
        print(f"有效期: {exp_time - nbf_time}")
    
    print("\n" + "=" * 50)
    print("🚀 请将上述JWT Token复制到代码中测试!")
