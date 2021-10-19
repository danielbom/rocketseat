import 'package:flutter/material.dart';
import 'package:payflow/shared/models/user_model.dart';

class UserProvider extends InheritedWidget {
  UserModel? user;

  UserProvider({ this.user, required Widget child }) : super(child: child);

  @override
  bool updateShouldNotify(UserProvider oldWidget) {
    return this.user != oldWidget.user;
  }

  static of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType(aspect: UserProvider);
  }
}
