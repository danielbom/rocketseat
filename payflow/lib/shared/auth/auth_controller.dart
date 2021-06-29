import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:payflow/shared/models/user_model.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthController {
  UserModel? _user;

  UserModel get user => _user!;

  void setUser(BuildContext context, UserModel? user) {
    if (user != null) {
      _user = user;
      this.saveUser(user);
      Navigator.pushReplacementNamed(context, "/home", arguments: user);
    } else {
      Navigator.pushReplacementNamed(context, "/login");
    }
  }

  Future<void> saveUser(UserModel user) async {
    final instance = await SharedPreferences.getInstance();
    await instance.setString("user", user.toJson());
  }

  Future<void> updateUser(BuildContext context) async {
    await Future.delayed(Duration(seconds: 2));

    final instance = await SharedPreferences.getInstance();
    if (instance.containsKey("user")) {
      final user = instance.getString("user")!;
      this.setUser(context, UserModel.fromJSON(user));
    } else {
      this.setUser(context, null);
    }
  }
}
