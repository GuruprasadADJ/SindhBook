const Relations_list=require('../../models/Relative_models/relations_list.model.js');

exports.getAllRelationsList=(req,res)=>{

     Relations_list.findOne()
     .then(result=>{
         if(result)
         {
            res.status(200).send({result:"success",message:"Showing all relations list",data:result});
         }
         else
         {
            //  var  data1=[];
            //  var father        =["son","daughter"];
            //  var mother        =["son","daughter"];
            //  var daughter      =["mother","father"];
            //  var son           =["mother","father"];
            //  var sister        =["brother","sister"];
            //  var brother       =["brother","sister"];
            //  var auntie        =["nephew","neice"];
            //  var uncle         =["nephew","neice"];
            //  var cousin_male   =["cousin_male","cousin_female"];
            //  var cousin_female =["cousin_male","cousin_female"];
            //  var grandmother   =["grandson","granddaughter"];
            //  var grandfather   =["grandson","granddaughter"];
            //  var grandson      =["grandmother","grandfather"];
            //  var granddaughter =["grandmother","grandfather"];
            //  var husband       =["wife"];
            //  var wife          =['husband'];
            //  var nephew        =["auntie","uncle"];
            //  var neice         =["auntie","uncle"];
            //  var data1=[];

             
            //  data1=[{"father":father,"mother":mother,"daughter":daughter,"son":son,"sister":sister,"brother":brother,
            //  "auntie":auntie,"uncle":uncle,"cousin_male":cousin_male,"cousin_female":cousin_female,
            //  "grandmother":grandmother,"grandfather":grandfather,"grandson":grandson,"granddaughter":granddaughter,
            //  "husband":husband,"wife":wife,"nephew":nephew,"neice":neice}];

             //data1[father]=father;
          
            const relationslist = new Relations_list({
                 //   data:data1
                father        :["son","daughter"],
                mother        :["son","daughter"],
                daughter      :["mother","father"],
                son           :["mother","father"],
                sister        :["brother","sister"],
                brother       :["brother","sister"],
                auntie        :["nephew","neice"],
                uncle         :["nephew","neice"],
                cousin_male   :["cousin_male","cousin_female"],
                cousin_female :["cousin_male","cousin_female"],
                grandmother   :["grandson","granddaughter"],
                grandfather   :["grandson","granddaughter"],
                grandson      :["grandmother","grandfather"],
                granddaughter :["grandmother","grandfather"],
                husband       :["wife"],
                wife          :['husband'],
                nephew        :["auntie","uncle"],
                neice         :["auntie","uncle"],
             },function(err,note1) {
                if (err) return res.status(500).send({result:"failed",message:"There was a problem adding the information into the database",errorMessage:err.message});
            })
            relationslist.save()
            .then(relationslist => {
                res.status(200).send({
                    result:"success",message:"Showing all relations list",data:relationslist
                });
            }).catch(err => {
                res.status(500).send({
                    result:"failed",message:"Data not inserted successfully",errorMessage:err.message
                });
            });
         }
     }).catch(err => {
        res.status(500).send({
            result:"failed",message:"Data not inserted successfully",errorMessage:err.message
        });
    });
}