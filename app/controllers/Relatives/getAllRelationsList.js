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
            const relationslist = new Relations_list({
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