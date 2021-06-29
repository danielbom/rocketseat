import 'dart:convert';

class UserModel {
  final String name;
  final String photoURL;

  UserModel({required this.name, required this.photoURL});

  Map<String, dynamic> toMap() => {
    "name": name,
    "photoURL": photoURL
  };
  
  factory UserModel.fromMap(Map<String, dynamic> map) => 
    UserModel(name: map["name"], photoURL: map["photoURL"]);

  String toJson() => jsonEncode(this.toMap());

  factory UserModel.fromJSON(String json) =>
    UserModel.fromMap(jsonDecode(json));

}
