import 'package:flutter/material.dart';
import 'package:payflow/modules/login/login_controller.dart';
import 'package:payflow/shared/models/user_model.dart';
import 'package:payflow/shared/themes/app_colors.dart';
import 'package:payflow/shared/themes/app_images.dart';
import 'package:payflow/shared/themes/app_text_styles.dart';
import 'package:payflow/shared/widget/social_login/social_login_button.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({ Key? key }) : super(key: key);

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final controller = LoginController();

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    final backgroundHighlight = Container(
      width: size.width,
      height: size.height * 0.36,
      color: AppColors.primary
    );
    final personImage = Positioned(
      top: 40,
      left: 10,
      right: 0,
      child: Image.asset(
        AppImages.person,
        width: 208,
        height: size.height * 0.4
      ),
    );
    
    final barCodeImage = Image.asset(AppImages.logomini);
    final basicDescription = Padding(
      padding: const EdgeInsets.only(top: 30, left: 70, right: 70),
      child: Text(
        "Organize seus boletos em um só lugar",
        textAlign: TextAlign.center,
        style: TextStyles.titleHome
      ),
    );
    final socialLoginButton = Padding(
      padding: const EdgeInsets.only(left: 40, right: 40, top: 40),
      child: SocialLoginButton(
        onTap: () {
          // Auth
          // controller.googleSignIn(context);

          // No auth
          final user = UserModel(name: "Daniel A. R. Farina", photoURL: "photoURL");
          controller.login(context, user);
        },
      ),
    );
    final itemsColumn = Positioned(
      bottom: size.height * 0.12,
      left: 0,
      right: 0,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          barCodeImage,
          basicDescription,
          socialLoginButton
        ]
      )
    );

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Container(
        width: size.width,
        height: size.height,
        child: Stack(children: [
          backgroundHighlight,
          personImage,
          itemsColumn,
        ])
      )
    );
  }
}
