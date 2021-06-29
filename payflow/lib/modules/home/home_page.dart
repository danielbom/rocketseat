import 'package:flutter/material.dart';
import 'package:payflow/modules/extract/extract_page.dart';
import 'package:payflow/modules/home/home_controller.dart';
import 'package:payflow/modules/my_boletos/my_boletos_page.dart';
import 'package:payflow/shared/models/user_model.dart';
import 'package:payflow/shared/themes/app_colors.dart';
import 'package:payflow/shared/themes/app_text_styles.dart';
import 'package:payflow/shared/widget/boleto_list/boleto_list_controller.dart';

class HomePage extends StatefulWidget {
  final UserModel? user; 

  const HomePage({ Key? key, this.user }): super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final controller = HomeController();
  
  setPage(index) {
    return () => this.setState(() {
      this.controller.setPage(index);
    });
  }

  activeCurrentPage(int page) => 
    this.controller.currentPage == page 
      ? AppColors.primary 
      : AppColors.body;

  @override
  Widget build(BuildContext context) {
    final pages = [
      MyBoletosPage(key: UniqueKey()),
      ExtractPage(key: UniqueKey()),
    ];

    final appBarTitle = Text.rich(
      TextSpan(
        text: "Olá, ",
        style: TextStyles.titleRegular,
        children: [
          TextSpan(
            text: this.widget.user?.name ?? "Daniel",
            style: TextStyles.titleBoldBackground
          )
        ]
      ),
    );
    final appBarSubtitle = Text(
      "Mantenha suas contas em dia",
      style: TextStyles.captionShape
    );
    final appBarUserImage = Container(
      height: 48,
      width: 48,
      decoration: BoxDecoration(
        // color: Colors.black,
        borderRadius: BorderRadius.circular(5),
        image: DecorationImage(
          image: NetworkImage(this.widget.user?.photoURL ?? "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50")
        )
      )
    );
    final appBar = PreferredSize(
      preferredSize: Size.fromHeight(152),
      child: Container(
        height: 152,
        color: AppColors.primary,
        child: ListTile(
          title: appBarTitle,
          subtitle: appBarSubtitle,
          trailing: appBarUserImage
        )
      ),
    );
    
    final homeButton = IconButton(
      onPressed: this.setPage(0),
      icon: Icon(
        Icons.home,
        color: this.activeCurrentPage(0)
      )
    );
    final barcodeScannerButton = GestureDetector(
      onTap: () {
        Navigator.pushNamed(context, "/barcode_scanner");
      },
      child: Container(
        width: 56,
        height: 56,
        decoration: BoxDecoration(
          color: AppColors.primary,
          borderRadius: BorderRadius.circular(5)
        ),
        child: Icon(
          Icons.add_box_outlined,
          color: AppColors.background
        )
      ),
    );
    final extractButton = IconButton(
      onPressed: this.setPage(1),
      icon: Icon(
        Icons.description_outlined,
        color: this.activeCurrentPage(1)
      )
    );
    final bottomNavigationBar = Container(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          homeButton,
          barcodeScannerButton,
          extractButton,
        ]
      )
    );
    
    return Scaffold(
      appBar: appBar,
      body: pages[controller.currentPage],
      bottomNavigationBar: bottomNavigationBar,
    );
  }
}
